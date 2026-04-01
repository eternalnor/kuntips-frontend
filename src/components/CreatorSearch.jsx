import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatorSearch({ label, placeholder, buttonText }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Strip leading @ (habit from social media), lowercase, trim
    const username = value.trim().replace(/^@/, "").toLowerCase();

    if (!username) {
      setError("Please enter a creator username.");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(username)) {
      setError("Usernames can only contain letters, numbers and underscores.");
      return;
    }

    navigate(`/${username}`);
  }

  return (
    <div className="creator-search">
      {label && <p className="creator-search__label">{label}</p>}
      <form className="creator-search__form" onSubmit={handleSubmit}>
        <div className="creator-search__input-wrap">
          <span className="creator-search__prefix">kuntips.no/</span>
          <input
            type="text"
            className="creator-search__input"
            placeholder={placeholder || "username"}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="btn btn-primary creator-search__btn">
          {buttonText || "Go to tip page"}
        </button>
      </form>
      {error && <p className="creator-search__error">{error}</p>}
    </div>
  );
}
