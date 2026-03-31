import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TipWidget } from '../components/TipWidget.jsx';

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
          'Something went wrong while loading this creator. Please try again in a moment.',
        );
        setCreator(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCreator();
  }, [username]);

  if (loading) {
    return (
      <main className="card status-block">
        <p>Loading profile…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="card status-block">
        <h1>Creator not found</h1>
        <p>
          No active creator with username <strong>{username}</strong> was found.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="card status-block">
        <h1>Something went wrong</h1>
        <p className="text-muted">{error}</p>
      </main>
    );
  }

  if (!creator) {
    return null;
  }

  const displayName = creator.display_name || username;
  const stripeConnected = creator.stripe_connected ?? false;
  const canReceiveTips = creator.can_receive_tips ?? stripeConnected;
  const keptPercent = creator.keptPercent ?? 95;
  const avatarUrl = creator.avatar_url || null;

  // Update page title + Open Graph tags for social sharing
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${displayName} — KunTips`;

    const siteUrl = window.location.href;
    const desc = creator.bio
      ? `${creator.bio} — Send an anonymous tip to ${displayName} on KunTips.`
      : `Send an anonymous tip to ${displayName} on KunTips. No account needed.`;

    setMetaTag('og:title', `Support ${displayName} on KunTips`);
    setMetaTag('og:description', desc);
    setMetaTag('og:url', siteUrl);
    setMetaTag('og:type', 'website');
    if (avatarUrl) setMetaTag('og:image', avatarUrl);

    return () => {
      document.title = prevTitle;
    };
  }, [displayName, creator.bio, avatarUrl]);

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
          <h2 className="creator-section-title">About</h2>
          <p className="text-muted">
            {creator.bio || 'This creator has not written a bio yet.'}
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
              <h2>Tips are temporarily unavailable</h2>
              <p className="text-muted">
                This creator is currently not able to receive tips. Please try again later.
              </p>
            </>
          ) : (
            <>
              <h2>Tips are not available yet</h2>
              <p className="text-muted">
                This creator hasn’t finished setting up payouts yet. Please try again later.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
