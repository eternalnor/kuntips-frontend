import { useEffect, useState } from "react";
import {
  adminGetTipsSettings,
  adminUpdateTipsSettings,
} from "../../api/admin.js";
import { usePageTitle } from "../../hooks/usePageTitle.js";

export default function AdminSettings() {
  usePageTitle("Settings");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  // Form state — strings while editing, parsed on submit
  const [minNok, setMinNok] = useState("");
  const [maxNok, setMaxNok] = useState("");
  const [presetsText, setPresetsText] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const d = await adminGetTipsSettings();
      setMinNok(String(d.min_nok));
      setMaxNok(String(d.max_nok));
      setPresetsText(d.presets.join(", "));
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const min = Number(minNok);
      const max = Number(maxNok);
      const presets = presetsText
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => Number(s));

      await adminUpdateTipsSettings({
        min_nok: min,
        max_nok: max,
        presets,
      });
      setSaveMessage("Saved.");
      await refresh();
    } catch (err) {
      setSaveMessage(
        "Failed: " + (err.data?.message || err.data?.error || err.message),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <p className="admin-page-sub">Platform-wide configuration.</p>

      {loading && <p className="admin-loading">Loading…</p>}
      {error && <p className="admin-login-error">{error}</p>}

      {!loading && (
        <section className="admin-section">
          <h2 className="admin-section-title">Tip amounts</h2>
          <p className="admin-muted" style={{ marginBottom: "1rem", maxWidth: "560px" }}>
            Controls what fans can tip on a creator's page. Minimum applies to both presets and the custom amount field. Maximum is capped at 10 000 NOK.
          </p>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Minimum tip (NOK)</span>
              <input
                type="number"
                min={1}
                max={9999}
                step={1}
                value={minNok}
                onChange={(e) => setMinNok(e.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Maximum tip (NOK)</span>
              <input
                type="number"
                min={2}
                max={10000}
                step={1}
                value={maxNok}
                onChange={(e) => setMaxNok(e.target.value)}
                required
              />
            </label>

            <label className="admin-field">
              <span>Preset amounts (NOK)</span>
              <input
                type="text"
                value={presetsText}
                onChange={(e) => setPresetsText(e.target.value)}
                placeholder="e.g. 50, 100, 250, 500, 1000"
                required
              />
              <span className="admin-field-hint">
                Comma- or space-separated. 1–6 values, ascending, each within the min/max range.
              </span>
            </label>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
              {saveMessage && (
                <span
                  className={
                    saveMessage.startsWith("Failed")
                      ? "admin-login-error"
                      : "admin-good"
                  }
                  style={{ fontSize: "0.9rem" }}
                >
                  {saveMessage}
                </span>
              )}
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
