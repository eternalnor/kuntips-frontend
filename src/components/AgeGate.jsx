import { useEffect, useState } from 'react';

const STORAGE_KEY = 'kuntips_age_confirmed';

export default function AgeGate({ children }) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setConfirmed(true);
    }
  }, []);

  const handleConfirm = () => {
    window.localStorage.setItem(STORAGE_KEY, 'true');
    setConfirmed(true);
  };

  if (confirmed) {
    return children;
  }

  return (
    <div className="agegate-overlay">
      <div className="agegate-modal">
        <h1>Adults Only</h1>
        <p>
          KunTips is intended for adults (18+). By continuing, you confirm that
          you are at least 18 years old and will not allow minors to access this
          site.
        </p>
        <button onClick={handleConfirm} className="agegate-button">
          I am 18 or older
        </button>
      </div>
    </div>
  );
}
