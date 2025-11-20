import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreatorPage from './pages/CreatorPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import CookiesPage from './pages/CookiesPage.jsx';
import CreatorAgreementPage from './pages/CreatorAgreementPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import Footer from './components/Footer.jsx';
import AgeGate from './components/AgeGate.jsx';

// NEW IMPORT ↓↓↓
import SiteHeader from './components/SiteHeader.jsx';

function App() {
  return (
    <AgeGate>
      <div className="app-root">
        <div className="app-shell">

          {/* NEW HEADER COMPONENT ↓↓↓ */}
          <SiteHeader />

          <Routes>
            {/* Landing page */}
            <Route path="/" element={<HomePage />} />

            {/* Creator public page: /u/:username */}
            <Route path="/u/:username" element={<CreatorPage />} />

            {/* Legal & support pages */}
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/cookies" element={<CookiesPage />} />
            <Route
              path="/legal/creator-agreement"
              element={<CreatorAgreementPage />}
            />
            <Route path="/support" element={<SupportPage />} />

            {/* Fallback / 404 */}
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

          <Footer />
        </div>
      </div>
    </AgeGate>
  );
}

export default App;
