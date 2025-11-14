import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreatorPage from './pages/CreatorPage.jsx';

function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<HomePage />} />

      {/* Creator public page: /u/:username */}
      <Route path="/u/:username" element={<CreatorPage />} />

      {/* Fallback */}
      <Route
        path="*"
        element={
          <main style={{ padding: '2rem' }}>
            <h1>Page not found</h1>
            <p>The page you’re looking for doesn’t exist.</p>
          </main>
        }
      />
    </Routes>
  );
}

export default App;
