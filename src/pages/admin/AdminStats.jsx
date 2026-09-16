import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminStats } from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

// Marketing statistics. Every panel states which population it counts, every
// rate carries its denominator, and creatives are ranked by a confidence
// bound rather than raw rate — a 1-of-2 fluke must never outrank a 30-of-100.

const WINDOWS = [7, 30, 90];
const MIN_UNIQUES_FOR_VERDICT = 25;

const COLORS = {
  uniques: "#38bdf8",
  registered: "#6366f1",
  connected: "#22c55e",
  firstTips: "#f59e0b",
  volume: "#38bdf8",
  net: "#22c55e",
  platform: "#a78bfa",
};

const CHART_THEME = {
  grid: "rgba(148, 163, 184, 0.14)",
  tick: { fill: "#94a3b8", fontSize: 11 },
  tooltip: {
    backgroundColor: "#0f172a",
    border: "1px solid rgba(99, 102, 241, 0.35)",
    borderRadius: 8,
    fontSize: 12,
  },
};

// ───────────────────────────── helpers ─────────────────────────────

function fmt(n) {
  return (n ?? 0).toLocaleString("nb-NO");
}

function fmtPct(v) {
  return v === null || v === undefined ? "—" : `${v.toLocaleString("nb-NO")} %`;
}

function fmtNok(n) {
  return n === null || n === undefined ? "—" : `${fmt(n)} kr`;
}

/** SQLite's 'YYYY-MM-DD HH:MM:SS' is UTC without a marker; treat it as such. */
function parseUtc(s) {
  if (!s) return null;
  const iso = /T/.test(s) ? s : s.replace(" ", "T") + "Z";
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? null : ms;
}

function timeAgo(s) {
  const ms = parseUtc(s);
  if (ms === null) return "—";
  const mins = Math.max(0, Math.round((Date.now() - ms) / 60000));
  if (mins < 60) return `${mins} min siden`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} t siden`;
  return `${Math.round(hours / 24)} d siden`;
}

function shortDay(iso) {
  try {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
  } catch {
    return iso;
  }
}

/** 95 % lower bound of a binomial proportion. */
function wilsonLower(hits, total, z = 1.96) {
  if (!total) return 0;
  const p = hits / total;
  const d = 1 + (z * z) / total;
  const centre = p + (z * z) / (2 * total);
  const margin = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * total)) / total);
  return Math.max(0, (centre - margin) / d);
}

/**
 * Rank creatives by the Wilson lower bound of their outcome rate. The leader
 * gets a star only when its lower bound beats the runner-up's observed rate;
 * otherwise "too close to call". Fewer than 25 uniques: not judged.
 */
function computeVerdicts(rows, hitKey) {
  const scored = rows.map((r) => ({
    key: r.key,
    hits: r[hitKey] || 0,
    total: r.uniques || 0,
    rate: r.uniques ? (r[hitKey] || 0) / r.uniques : 0,
    lb: wilsonLower(r[hitKey] || 0, r.uniques || 0),
    qualifies: (r.uniques || 0) >= MIN_UNIQUES_FOR_VERDICT,
  }));
  const qualifying = scored.filter((s) => s.qualifies).sort((a, b) => b.lb - a.lb);
  const verdicts = new Map();
  for (const s of scored) {
    verdicts.set(s.key, s.qualifies ? { label: "", kind: "" } : { label: "for tidlig", kind: "early" });
  }
  if (qualifying.length === 1) {
    verdicts.set(qualifying[0].key, { label: "best så langt — ingenting å sammenligne med", kind: "only" });
  } else if (qualifying.length >= 2) {
    const [lead, runner] = qualifying;
    verdicts.set(
      lead.key,
      lead.lb > runner.rate ? { label: "★ best", kind: "best" } : { label: "for jevnt til å avgjøre", kind: "close" },
    );
  }
  return { verdicts, lower: new Map(scored.map((s) => [s.key, s.lb])) };
}

function downloadCsv(filename, rows, columns) {
  const esc = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => esc(c.label)).join(";");
  const body = rows.map((r) => columns.map((c) => esc(c.get ? c.get(r) : r[c.key])).join(";"));
  const blob = new Blob(["﻿" + [header, ...body].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ───────────────────────────── building blocks ─────────────────────────────

function StatCard({ label, value, sub, highlight, warn }) {
  return (
    <div
      className={
        "admin-stat-card" +
        (highlight ? " admin-stat-card--highlight" : "") +
        (warn ? " admin-stat-card--warn" : "")
      }
    >
      <span className="admin-stat-card__label">{label}</span>
      <span className="admin-stat-card__value">{value}</span>
      {sub && <span className="admin-stat-card__sub">{sub}</span>}
    </div>
  );
}

function SectionHeader({ title, note, onCsv }) {
  return (
    <div className="admin-section-head">
      <h2 className="admin-section-title">{title}</h2>
      <div className="admin-section-head__right">
        {note && <span className="admin-note">{note}</span>}
        {onCsv && (
          <button type="button" className="admin-btn-small" onClick={onCsv}>
            CSV
          </button>
        )}
      </div>
    </div>
  );
}

function FunnelBars({ title, f }) {
  const steps = [
    ["Registrert", f.registered, f.registered],
    ["E-post verifisert", f.verified, f.registered],
    ["Stripe startet", f.stripeStarted, f.verified],
    ["Stripe koblet til", f.connected, f.stripeStarted],
    ["Første tips", f.firstTip, f.connected],
  ];
  return (
    <div className="admin-half">
      <h3 className="admin-h3">{title}</h3>
      <div className="admin-funnel">
        {steps.map(([label, value, prev], i) => {
          const ofTotal = f.registered > 0 ? Math.round((value / f.registered) * 100) : 0;
          const stepPct = i === 0 ? null : prev > 0 ? Math.round((value / prev) * 100) : null;
          return (
            <div className="admin-funnel__step" key={label}>
              <div className="admin-funnel__header">
                <span>{label}</span>
                <span className="admin-muted">
                  {fmt(value)} ({ofTotal} %{stepPct !== null ? ` · ${stepPct} % av forrige` : ""})
                </span>
              </div>
              <div className="admin-funnel__bar">
                <div className="admin-funnel__fill" style={{ width: `${ofTotal}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SEGMENT_COLUMNS = [
  { key: "key", label: "Segment" },
  { key: "visits", label: "Besøk" },
  { key: "uniques", label: "Unike" },
  { key: "paidVisits", label: "Betalte besøk" },
  { key: "registered", label: "Registrert" },
  { key: "verified", label: "Verifisert" },
  { key: "connected", label: "Stripe koblet" },
  { key: "firstTip", label: "Første tips" },
  { key: "registeredRatePct", label: "Registrert-rate %" },
  { key: "connectedRatePct", label: "Stripe-rate %" },
];

function SegmentTable({ rows, firstColumn = "Segment", emptyText = "Ingen data i vinduet." }) {
  if (!rows || rows.length === 0) return <p className="admin-muted">{emptyText}</p>;
  return (
    <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>{firstColumn}</th>
            <th>Besøk</th>
            <th>Unike</th>
            <th>Betalte</th>
            <th>Registrert</th>
            <th>Verifisert</th>
            <th>Stripe</th>
            <th>Første tips</th>
            <th>Reg.-rate</th>
            <th>Stripe-rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td className="admin-mono">{r.key}</td>
              <td>{fmt(r.visits)}</td>
              <td>{fmt(r.uniques)}</td>
              <td>{fmt(r.paidVisits)}</td>
              <td>{fmt(r.registered)}</td>
              <td>{fmt(r.verified)}</td>
              <td>{fmt(r.connected)}</td>
              <td>{fmt(r.firstTip)}</td>
              <td>{fmtPct(r.registeredRatePct)}</td>
              <td>{fmtPct(r.connectedRatePct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────────── page ─────────────────────────────

export default function AdminStats() {
  usePageTitle("Stats");
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [funnelSeries, setFunnelSeries] = useState({ uniques: true, registered: true, connected: true, firstTips: false });
  const [outcome, setOutcome] = useState("connected");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminStats(days)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Kunne ikke laste statistikk");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const creativeVerdicts = useMemo(
    () => (data ? computeVerdicts(data.byCreative, outcome) : null),
    [data, outcome],
  );

  const windowLinks = (
    <div className="admin-window-links">
      {WINDOWS.map((w) => (
        <button
          key={w}
          type="button"
          className={"admin-window-link" + (w === days ? " admin-window-link--active" : "")}
          onClick={() => setDays(w)}
        >
          {w} dager
        </button>
      ))}
    </div>
  );

  if (loading && !data) {
    return (
      <div className="admin-page">
        <h1>Stats</h1>
        <p className="admin-loading">Laster…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>Stats</h1>
        {windowLinks}
        <p className="admin-login-error">{error}</p>
      </div>
    );
  }

  const { meta, traffic, series, funnel, bySource, byCreative, byDevice, byOs, byInApp, byCountry, byReferrer, tips, retention, referrals, health, learning } = data;
  const testCodeOn = health.testCodeActive.meta || health.testCodeActive.tiktok;
  const chartSeries = series.map((p) => ({ ...p, label: shortDay(p.date) }));

  return (
    <div className="admin-page">
      <div className="admin-section-head">
        <div>
          <h1>Stats</h1>
          <p className="admin-page-sub">
            Siste {meta.days} dager · dager telles i {meta.timezone} (UTC{meta.offsetHours >= 0 ? "+" : ""}
            {meta.offsetHours}) — samme dag som annonseplattformene fakturerer på · ekte skapere (seed ekskludert)
          </p>
        </div>
        {windowLinks}
      </div>
      {loading && <p className="admin-loading">Oppdaterer…</p>}

      {/* ── tracker health ── */}
      <section className="admin-section">
        <SectionHeader title="Sporingshelse (server-side pixels)" />
        {testCodeOn && (
          <div className="admin-warn-banner">
            <strong>Test-event-kode er aktiv</strong> ({health.testCodeActive.meta ? "Meta" : ""}
            {health.testCodeActive.meta && health.testCodeActive.tiktok ? " + " : ""}
            {health.testCodeActive.tiktok ? "TikTok" : ""}). Alle konverteringer går til Test Events-visningen og
            teller for ingenting i kampanjene. Slett hemmeligheten:{" "}
            <code>npx wrangler secret delete META_TEST_EVENT_CODE</code> /{" "}
            <code>npx wrangler secret delete TIKTOK_TEST_EVENT_CODE</code>
          </div>
        )}
        <div className="admin-stat-grid">
          {health.platforms.map((p) => (
            <div
              key={p.platform}
              className={"admin-health" + (!p.configured || p.errorsInWindow > 0 ? " admin-health--warn" : "")}
            >
              <div className="admin-health__title">
                {p.platform === "meta" ? "Meta CAPI" : "TikTok Events API"}
                <span className={"admin-chip" + (p.configured ? "" : " admin-chip--bad")}>
                  {p.configured ? "konfigurert" : "ikke konfigurert"}
                </span>
              </div>
              <dl className="admin-dl">
                <dt>Siste vellykkede sending</dt>
                <dd>{p.lastOkAt ? `${timeAgo(p.lastOkAt)} (${p.lastOkEvent})` : "aldri"}</dd>
                <dt>OK / feil i vinduet</dt>
                <dd>
                  {fmt(p.okInWindow)} / <span className={p.errorsInWindow > 0 ? "admin-bad" : ""}>{fmt(p.errorsInWindow)}</span>
                  {p.testSendsInWindow > 0 && <span className="admin-muted"> · {fmt(p.testSendsInWindow)} testsendinger</span>}
                </dd>
                {p.byEvent.length > 0 && (
                  <>
                    <dt>Per event</dt>
                    <dd>
                      {p.byEvent.map((e) => `${e.event}: ${e.ok} ok${e.failed ? ` / ${e.failed} feil` : ""}`).join(" · ")}
                    </dd>
                  </>
                )}
                {p.lastError && (
                  <>
                    <dt>Siste feil</dt>
                    <dd className="admin-bad">
                      {timeAgo(p.lastError.at)}
                      {p.lastError.status ? ` · HTTP ${p.lastError.status}` : ""}
                      {p.lastError.detail ? ` · ${p.lastError.detail.slice(0, 160)}` : ""}
                    </dd>
                  </>
                )}
              </dl>
            </div>
          ))}
        </div>
        <p className="admin-note">
          Sendinger skjer bare ved registrering (Lead / CompleteRegistration), Stripe-tilkobling og tips — så «siste
          vellykkede» for lenge siden betyr lite trafikk, ikke nødvendigvis feil. Feil i vinduet betyr noe.
        </p>
      </section>

      {/* ── learning phase ── */}
      <section className="admin-section">
        <SectionHeader
          title="Læringsfase (rullerende 7 dager, uavhengig av vinduet)"
          note={`Mål: ~${learning.target} konverteringer per annonsesett i læringsvinduet`}
        />
        <div className="admin-stat-grid">
          {learning.platforms.map((p) => (
            <StatCard
              key={p.platform}
              label={`${p.platform === "meta" ? "Meta" : "TikTok"} · ${p.event}`}
              value={`${fmt(p.conversions7d)} / ${learning.target}`}
              sub={
                p.status === "no_data"
                  ? "ingen sendinger siste 7 dager"
                  : p.status === "likely_out"
                    ? "trolig ute av læringsfasen — en utfordrer kan settes inn"
                    : `${fmt(p.last24h)} siste 24 t${p.etaDays ? ` · ~${p.etaDays} dager igjen` : ""} — la annonsesettet være i fred; hver endring nullstiller tellingen`
              }
              highlight={p.status === "likely_out"}
            />
          ))}
        </div>
        <p className="admin-note">
          Dette er et tak: plattformen teller bare det den selv klarer å attribuere (typisk ~⅔ av våre tall), og panelet
          kan ikke se endringer gjort i annonsesettet.
        </p>
      </section>

      {/* ── traffic ── */}
      <section className="admin-section">
        <SectionHeader title="Trafikk" note="Én ping per nettleserøkt · «unike» er personer, ikke besøk" />
        <div className="admin-stat-grid">
          <StatCard label="Besøk (mennesker)" value={fmt(traffic.humans)} sub={`${fmt(traffic.visits)} totalt inkl. roboter`} />
          <StatCard label="Unike besøkende" value={fmt(traffic.uniques)} highlight />
          <StatCard label="Roboter" value={fmt(traffic.bots)} sub={fmtPct(traffic.botSharePct) + " av alle treff"} />
          <StatCard label="Betalte besøk" value={fmt(traffic.paidVisits)} sub="landet med ekte annonse-id" />
          <StatCard label="I app-nettleser" value={fmt(traffic.inAppVisits)} sub="TikTok/Instagram/Facebook m.fl." />
        </div>
      </section>

      {/* ── funnel over time ── */}
      <section className="admin-section">
        <SectionHeader
          title="Trakt over tid"
          note="hendelsen telles på dagen den skjedde"
          onCsv={() =>
            downloadCsv(`kuntips-serie-${days}d.csv`, series, [
              { key: "date", label: "Dato" },
              { key: "visits", label: "Besøk" },
              { key: "uniques", label: "Unike" },
              { key: "paidVisits", label: "Betalte besøk" },
              { key: "registered", label: "Registrert" },
              { key: "connected", label: "Stripe koblet" },
              { key: "firstTips", label: "Første tips" },
              { key: "tips", label: "Tips" },
              { key: "volumeNok", label: "Volum kr" },
              { key: "creatorNetNok", label: "Til skapere kr" },
              { key: "platformNok", label: "Plattform kr" },
            ])
          }
        />
        <div className="admin-toggles">
          {[
            ["uniques", "Unike besøkende"],
            ["registered", "Registrert"],
            ["connected", "Stripe koblet til"],
            ["firstTips", "Første tips"],
          ].map(([k, label]) => (
            <label key={k} className="admin-toggle" style={{ color: COLORS[k] }}>
              <input
                type="checkbox"
                checked={!!funnelSeries[k]}
                onChange={(e) => setFunnelSeries((s) => ({ ...s, [k]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="admin-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartSeries} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid} vertical={false} />
              <XAxis dataKey="label" tick={CHART_THEME.tick} interval="preserveStartEnd" />
              <YAxis tick={CHART_THEME.tick} allowDecimals={false} />
              <Tooltip contentStyle={CHART_THEME.tooltip} />
              <Legend />
              {funnelSeries.uniques && <Line type="monotone" dataKey="uniques" name="Unike" stroke={COLORS.uniques} dot={false} strokeWidth={2} />}
              {funnelSeries.registered && <Line type="monotone" dataKey="registered" name="Registrert" stroke={COLORS.registered} dot={false} strokeWidth={2} />}
              {funnelSeries.connected && <Line type="monotone" dataKey="connected" name="Stripe koblet" stroke={COLORS.connected} dot={false} strokeWidth={2} />}
              {funnelSeries.firstTips && <Line type="monotone" dataKey="firstTips" name="Første tips" stroke={COLORS.firstTips} dot={false} strokeWidth={2} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── money over time ── */}
      <section className="admin-section">
        <SectionHeader title="Penger over tid (kr, gjennomførte tips)" />
        <div className="admin-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeries} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid} vertical={false} />
              <XAxis dataKey="label" tick={CHART_THEME.tick} interval="preserveStartEnd" />
              <YAxis tick={CHART_THEME.tick} />
              <Tooltip contentStyle={CHART_THEME.tooltip} />
              <Legend />
              <Bar dataKey="volumeNok" name="Volum" fill={COLORS.volume} radius={[3, 3, 0, 0]} />
              <Bar dataKey="creatorNetNok" name="Til skapere" fill={COLORS.net} radius={[3, 3, 0, 0]} />
              <Bar dataKey="platformNok" name="Plattform" fill={COLORS.platform} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── funnel rates ── */}
      <section className="admin-section">
        <SectionHeader title="Trakt som rater" note="steg-prosent = av forrige steg" />
        <div className="admin-split">
          <FunnelBars title={`Registrert siste ${meta.days} dager`} f={funnel.window} />
          <FunnelBars title="Alle skapere" f={funnel.allTime} />
        </div>
      </section>

      {/* ── by source ── */}
      <section className="admin-section">
        <SectionHeader
          title="Per kilde (ref-kode på landingen)"
          note="registreringer via signup_code · «direkte/organisk» = uten kode"
          onCsv={() => downloadCsv(`kuntips-kilder-${days}d.csv`, bySource, SEGMENT_COLUMNS)}
        />
        <SegmentTable rows={bySource} firstColumn="Kode" />
      </section>

      {/* ── by creative ── */}
      <section className="admin-section">
        <SectionHeader
          title="Per annonsekreativ (kun betalte besøk)"
          note={`verdict etter Wilson 95 % nedre grense · minst ${MIN_UNIQUES_FOR_VERDICT} unike før den dømmes`}
          onCsv={() =>
            downloadCsv(`kuntips-kreativer-${days}d.csv`, byCreative, [
              { key: "key", label: "Annonse-id" },
              { key: "code", label: "Kode" },
              { key: "firstDay", label: "Første dag" },
              { key: "lastDay", label: "Siste dag" },
              ...SEGMENT_COLUMNS.slice(1),
            ])
          }
        />
        <div className="admin-toggles">
          <span className="admin-muted">Døm etter:</span>
          {[
            ["registered", "registrert"],
            ["connected", "Stripe koblet til"],
          ].map(([k, label]) => (
            <label key={k} className="admin-toggle">
              <input type="radio" name="outcome" checked={outcome === k} onChange={() => setOutcome(k)} />
              {label}
            </label>
          ))}
        </div>
        {byCreative.length === 0 ? (
          <p className="admin-muted">
            Ingen betalte besøk med annonse-id ennå. Landingslenken i annonsen må ha{" "}
            <code>?ref=TIKTOK1&ad=__CID__</code> (TikTok) eller <code>?ref=IG1&ad={"{{ad.id}}"}</code> (Meta).
          </p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Annonse-id</th>
                  <th>Kode</th>
                  <th>Periode</th>
                  <th>Unike</th>
                  <th>Registrert</th>
                  <th>Stripe</th>
                  <th>Rate</th>
                  <th>Nedre grense</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {byCreative.map((r) => {
                  const v = creativeVerdicts.verdicts.get(r.key);
                  const lb = creativeVerdicts.lower.get(r.key) || 0;
                  const rate = outcome === "connected" ? r.connectedRatePct : r.registeredRatePct;
                  return (
                    <tr key={r.key}>
                      <td className="admin-mono">{r.key}</td>
                      <td className="admin-mono">{r.code || "—"}</td>
                      <td className="admin-muted">
                        {r.firstDay ? shortDay(r.firstDay) : "—"}
                        {r.lastDay && r.lastDay !== r.firstDay ? ` – ${shortDay(r.lastDay)}` : ""}
                      </td>
                      <td>{fmt(r.uniques)}</td>
                      <td>{fmt(r.registered)}</td>
                      <td>{fmt(r.connected)}</td>
                      <td>{fmtPct(rate)}</td>
                      <td>{r.uniques ? `${(lb * 100).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} %` : "—"}</td>
                      <td>{v?.label ? <span className={`admin-verdict admin-verdict--${v.kind}`}>{v.label}</span> : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="admin-note">
          Rangert etter nedre grense, ikke rå rate — en større prøve gir strammere grense, så lederen kan vise en lavere
          prosent enn raden under. Plattformens egne tall og disse er ulike tall; les plattformen en dag på etterskudd.
        </p>
      </section>

      {/* ── device / os / in-app ── */}
      <section className="admin-section">
        <SectionHeader
          title="Per enhet, OS og app-nettleser"
          note="registrering + Stripe krever at reisen overlever nettleseren den startet i"
          onCsv={() =>
            downloadCsv(`kuntips-enheter-${days}d.csv`, [
              ...byDevice.map((r) => ({ ...r, key: `enhet: ${r.key}` })),
              ...byOs.map((r) => ({ ...r, key: `os: ${r.key}` })),
              ...byInApp.map((r) => ({ ...r, key: `app: ${r.key}` })),
            ], SEGMENT_COLUMNS)
          }
        />
        <div className="admin-split">
          <div className="admin-half">
            <h3 className="admin-h3">Enhet</h3>
            <SegmentTable rows={byDevice} firstColumn="Enhet" />
          </div>
          <div className="admin-half">
            <h3 className="admin-h3">OS</h3>
            <SegmentTable rows={byOs} firstColumn="OS" />
          </div>
        </div>
        <div className="admin-split">
          <div className="admin-half">
            <h3 className="admin-h3">App-nettleser vs. vanlig nettleser</h3>
            <SegmentTable rows={byInApp} firstColumn="Nettleser" />
          </div>
          <div className="admin-half">
            <h3 className="admin-h3">Land</h3>
            <SegmentTable rows={byCountry} firstColumn="Land" />
          </div>
        </div>
      </section>

      {/* ── referrers ── */}
      <section className="admin-section">
        <SectionHeader title="Henvisende nettsteder" note="document.referrer-vert · mange plattformer stripper den" />
        {byReferrer.length === 0 ? (
          <p className="admin-muted">Ingen henvisninger registrert i vinduet.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vert</th>
                  <th>Besøk</th>
                  <th>Unike</th>
                </tr>
              </thead>
              <tbody>
                {byReferrer.map((r) => (
                  <tr key={r.host}>
                    <td className="admin-mono">{r.host}</td>
                    <td>{fmt(r.visits)}</td>
                    <td>{fmt(r.uniques)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── tips ── */}
      <section className="admin-section">
        <SectionHeader
          title="Tips-atferd (gjennomførte tips i vinduet)"
          note={tips.truncated ? "beregnet på de siste 5 000 tipsene" : undefined}
          onCsv={() =>
            downloadCsv(`kuntips-tipsfordeling-${days}d.csv`, tips.buckets, [
              { key: "label", label: "Beløp kr" },
              { key: "count", label: "Antall" },
            ])
          }
        />
        <div className="admin-stat-grid">
          <StatCard label="Tips" value={fmt(tips.count)} sub={`${fmt(tips.creatorsTipped)} skapere fikk tips`} />
          <StatCard label="Volum" value={fmtNok(tips.volumeNok)} sub={`${fmtNok(tips.creatorNetNok)} til skapere · ${fmtNok(tips.platformNok)} plattform`} highlight />
          <StatCard label="Snitt-tips" value={fmtNok(tips.avgNok)} sub={`median ${fmtNok(tips.medianNok)}`} />
          <StatCard label="90-persentil" value={fmtNok(tips.p90Nok)} sub={`største ${fmtNok(tips.maxNok)}`} />
          <StatCard label="Anonyme tips" value={fmtPct(tips.anonymousPct)} sub="uten navn" />
          <StatCard label="Forhåndsvalgte beløp" value={fmtPct(tips.presetPct)} sub="50/100/250/500/1000" />
        </div>
        <div className="admin-chart admin-chart--short">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tips.buckets} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={CHART_THEME.grid} vertical={false} />
              <XAxis dataKey="label" tick={CHART_THEME.tick} />
              <YAxis tick={CHART_THEME.tick} allowDecimals={false} />
              <Tooltip contentStyle={CHART_THEME.tooltip} />
              <Bar dataKey="count" name="Tips" fill={COLORS.registered} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="admin-note">
          Gjengangere blant tipsere kan ikke måles: kvitterings-e-post lagres ikke hos oss (den går rett til Stripe).
        </p>
      </section>

      {/* ── retention ── */}
      <section className="admin-section">
        <SectionHeader
          title="Retensjon per Stripe-tilkoblingsmåned"
          note="alle tilkoblede skapere, uavhengig av vinduet · rater kun for kohorter som er gamle nok"
          onCsv={() =>
            downloadCsv("kuntips-kohorter.csv", retention.cohorts, [
              { key: "month", label: "Måned" },
              { key: "creators", label: "Skapere" },
              { key: "tip30", label: "Tips innen 30 d" },
              { key: "eligible30", label: "Gamle nok (30 d)" },
              { key: "tip60", label: "Tips innen 60 d" },
              { key: "eligible60", label: "Gamle nok (60 d)" },
              { key: "tip90", label: "Tips innen 90 d" },
              { key: "eligible90", label: "Gamle nok (90 d)" },
              { key: "activeLast30", label: "Aktive siste 30 d" },
            ])
          }
        />
        <div className="admin-stat-grid">
          <StatCard label="Stripe-koblede skapere" value={fmt(retention.connectedTotal)} />
          <StatCard
            label="Aktive siste 30 dager"
            value={fmt(retention.activeLast30Total)}
            sub={fmtPct(retention.connectedTotal ? Math.round((retention.activeLast30Total / retention.connectedTotal) * 1000) / 10 : null) + " av tilkoblede"}
            highlight
          />
        </div>
        {retention.cohorts.length === 0 ? (
          <p className="admin-muted">Ingen tilkoblede skapere ennå.</p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kohort</th>
                  <th>Skapere</th>
                  <th>Første tips ≤ 30 d</th>
                  <th>≤ 60 d</th>
                  <th>≤ 90 d</th>
                  <th>Aktive siste 30 d</th>
                </tr>
              </thead>
              <tbody>
                {retention.cohorts.map((c) => {
                  const cell = (hit, elig) =>
                    elig > 0 ? `${hit}/${elig} (${Math.round((hit / elig) * 100)} %)` : "for ung";
                  return (
                    <tr key={c.month}>
                      <td className="admin-mono">{c.month}</td>
                      <td>{fmt(c.creators)}</td>
                      <td>{cell(c.tip30, c.eligible30)}</td>
                      <td>{cell(c.tip60, c.eligible60)}</td>
                      <td>{cell(c.tip90, c.eligible90)}</td>
                      <td>{fmt(c.activeLast30)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── referrals & payouts ── */}
      <section className="admin-section">
        <SectionHeader title="Verving og utbetalinger i vinduet" />
        <div className="admin-stat-grid">
          <StatCard label="Skaper-vervinger" value={fmt(referrals.creatorReferrals)} sub="skaper vervet skaper" />
          <StatCard label="Utbetalinger bestilt" value={fmt(referrals.payoutsRequested)} />
          <StatCard label="Utbetalinger betalt" value={fmt(referrals.payoutsPaid)} sub={fmtNok(referrals.payoutsPaidNok)} />
        </div>
      </section>

      <p className="admin-note">
        Generert {new Date(meta.generatedAt).toLocaleString("nb-NO")}. Tabellene teller en skaper på dagen hen
        registrerte seg; grafen teller hendelsen på dagen den skjedde — summene kan derfor avvike litt.
      </p>
    </div>
  );
}
