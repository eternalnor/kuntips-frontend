import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreatorPage from './pages/CreatorPage.jsx';

function App() {
  return (
    <div className="app-root">
      <div className="app-shell">
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Creator public page: /u/:username */}
          <Route path="/u/:username" element={<CreatorPage />} />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <main className="card status-block">
                <h1>Page not found</h1>
                <p>The page you’re looking for doesn’t exist.</p>
              </main>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
