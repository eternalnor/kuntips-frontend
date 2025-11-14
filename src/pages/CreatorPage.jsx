import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
      <main style={{ padding: '2rem' }}>
        <p>Loading profile…</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Creator not found</h1>
        <p>No active creator with username <strong>{username}</strong> was found.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </main>
    );
  }

  // If we get here, we have a creator
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <section
        style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '50%',
            backgroundColor: '#eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {/* Placeholder avatar: first letter */}
          {creator.display_name?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div>
          <h1 style={{ margin: 0 }}>{creator.display_name}</h1>
          <p style={{ margin: '0.25rem 0', color: '#666' }}>
            @{creator.username}
          </p>
        </div>
      </section>

      <section>
        <h2>About</h2>
        <p>{creator.bio || 'This creator has not written a bio yet.'}</p>
      </section>
    </main>
  );
}
