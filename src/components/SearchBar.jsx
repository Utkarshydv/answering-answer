import React, { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResults = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setError(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'No results found.');
      }
    } catch (err) {
      setError('Error fetching results.');
    }
    setLoading(false);
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar-form" onSubmit={fetchResults}>
        <input
          type="text"
          className="search-input"
          value={query}
          placeholder="Search the web…"
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" className="search-icon-btn" aria-label="Search">
          {/* SVG magnifier icon */}
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </form>

      <div className="search-results-block">
        {loading && <div>Searching…</div>}
        {error && <div className="search-error">{error}</div>}
        <ul className="search-results">
          {results.map((item, idx) => (
            <li key={idx} className="search-result-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
              <div className="search-result-desc">{item.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
