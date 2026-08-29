import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TipWidget } from '../components/TipWidget.jsx';
import { useTipLang } from '../hooks/useTipLang.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function setMetaTag(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function CreatorPage() {
  const { t, tf } = useTipLang();
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    async function fetchCreator() {
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/creators/${username}`);

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          if (data?.error === 'creator_not_found') {
            setNotFound(true);
            setCreator(null);
          } else {
            throw new Error(data?.message || `Request failed with ${res.status}`);
          }
        } else {
          setCreator(data);
        }
      } catch (err) {
        console.error('Error fetching creator', err);
        setError(
          t.errorBody,
        );
        setCreator(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCreator();
  }, [username]);

  const displayName = creator?.display_name || username;
  const stripeConnected = creator?.stripe_connected ?? false;
  const canReceiveTips = creator?.can_receive_tips ?? stripeConnected;
  const keptPercent = creator?.keptPercent ?? 95;
  const avatarUrl = creator?.avatar_url || null;

  // Update page title + Open Graph tags for social sharing
  // Must be called unconditionally (before any early returns) — Rules of Hooks
  useEffect(() => {
    if (!creator) return;

    const prevTitle = document.title;
    document.title = `${displayName} — KunTips`;

    const siteUrl = window.location.href;
    const desc = creator.bio
      ? `${creator.bio} — Send a tip to ${displayName} on KunTips.`
      : `Send a tip to ${displayName} on KunTips. No account needed.`;

    setMetaTag('og:title', `Support ${displayName} on KunTips`);
    setMetaTag('og:description', desc);
    setMetaTag('og:url', siteUrl);
    setMetaTag('og:type', 'website');
    if (avatarUrl) setMetaTag('og:image', avatarUrl);

    return () => {
      document.title = prevTitle;
    };
  }, [creator, displayName, avatarUrl]);

  if (loading) {
    return (
      <main className="card status-block">
        <p>{t.loadingProfile}</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="card status-block">
        <h1>{t.notFoundTitle}</h1>
        <p>
          {tf('notFoundBody', { name: username })}
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="card status-block">
        <h1>{t.errorTitle}</h1>
        <p className="text-muted">{error}</p>
      </main>
    );
  }

  if (!creator) {
    return null;
  }

  return (
    <main className="card">
      <div className="creator-page">
        <header className="creator-header">
          <div className="creator-avatar">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="creator-avatar-img"
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="creator-meta">
            <h1>{displayName}</h1>
            <p className="creator-meta-username">@{creator.username}</p>
          </div>
        </header>

        <section className="creator-section">
          <h2 className="creator-section-title">{t.about}</h2>
          <p className="text-muted">
            {creator.bio || t.noBio}
          </p>
        </section>

        <section className="creator-section">
          {canReceiveTips ? (
            <TipWidget
              creatorUsername={creator.username}
              creatorDisplayName={displayName}
              creatorKeptPercent={keptPercent}
            />
          ) : stripeConnected ? (
            <>
              <h2>{t.tempUnavailableTitle}</h2>
              <p className="text-muted">
                {t.tempUnavailableBody}
              </p>
            </>
          ) : (
            <>
              <h2>{t.notReadyTitle}</h2>
              <p className="text-muted">
                {t.notReadyBody}
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
