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

  // If we get here, we have a creator
  return (
    <main className="card">
      <div className="creator-page">
        <header className="creator-header">
          <div className="creator-avatar">
            {creator.display_name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          <div className="creator-meta">
            <h1>{creator.display_name}</h1>

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
            creatorDisplayName={creator.display_name}
          />
        </section>
      </div>
    </main>
  );
}
