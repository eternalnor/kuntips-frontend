import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TipWidget } from '../components/TipWidget.jsx';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreatorPage() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  // Resolve a display name that works with both old (display_name) and new (displayName) shapes
  const resolvedDisplayName =
    creator?.display_name || creator?.displayName || username;


  useEffect(() => {
    if (!username) return;

    async function fetchCreator() {
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/creators/${username}`);

        if (res.status === 404) {
          setNotFound(true);
          setCreator(null);
        } else if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.message || `Request failed with ${res.status}`);
        } else {
          const data = await res.json();
          setCreator(data);
        }
      } catch (err) {
        setError(err.message);
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

  const canReceiveTips = creator?.can_receive_tips ?? true;
  const stripeConnected = creator?.stripe_connected ?? false;

  // If we get here, we have a creator
  return (
    <main className="card">
      <div className="creator-page">
        <header className="creator-header">
          <div className="creator-avatar">
            {resolvedDisplayName?.charAt(0)?.toUpperCase() || '?'}
          </div>

          <div className="creator-meta">
            <h1>{resolvedDisplayName}</h1>

            <p className="creator-meta-username">@{creator.username}</p>
          </div>
        </header>

        <section className="creator-section">
          <h2 className="creator-section-title">About</h2>
          <p className="text-muted">
            {creator.bio || 'This creator has not written a bio yet.'}
          </p>
        </section>
        {/* New: Tip widget section */}
        <section className="creator-section">
          <TipWidget
            creatorUsername={creator.username}
            creatorDisplayName={resolvedDisplayName}
            creatorKeptPercent={creator.keptPercent}
          />
        </section>
        {/* Tip widget / status */}
        <section className="creator-section">
          {canReceiveTips ? (
              <TipWidget
              creatorUsername={creator.username}
              creatorDisplayName={creator.display_name}
            />
          ) : stripeConnected ? (
            <>
              <h2>Tips are temporarily unavailable</h2>
              <p className="text-muted">
                This creator is currently not able to receive tips. Please try
                again later.
              </p>
            </>
          ) : (
            <>
              <h2>Tips are not available yet</h2>
              <p className="text-muted">
                This creator hasn’t finished setting up payouts yet. Please try
                again later.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

