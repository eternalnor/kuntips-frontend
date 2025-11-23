import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CreatorPage from './pages/CreatorPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import CookiesPage from './pages/CookiesPage.jsx';
import CreatorAgreementPage from './pages/CreatorAgreementPage.jsx';
import SupportPage from './pages/SupportPage.jsx';
import Footer from './components/Footer.jsx';
import SiteHeader from './components/SiteHeader.jsx';
import CreatorsLanding from "./CreatorsLanding";
import CreatorsStart from "./CreatorsStart";
import CreatorsDashboard from "./CreatorsDashboard";


function App() {
  return (
    <div className="app-root">
      <div className="app-shell">
        <SiteHeader />

        <div className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/u/:username" element={<CreatorPage />} />
            <Route path="/legal/terms" element={<TermsPage />} />
            <Route path="/legal/privacy" element={<PrivacyPage />} />
            <Route path="/legal/cookies" element={<CookiesPage />} />
            <Route path="/legal/creator-agreement" element={<CreatorAgreementPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/creators" element={<CreatorsLanding />} />
            <Route path="/creators/start" element={<CreatorsStart />} />
            <Route path="/creators/dashboard" element={<CreatorsDashboard />} />
            <Route path="*" element={
                <main className="page page-legal">
                  <h1 className="page-title">Page not found</h1>
                  <p>The page you’re looking for doesn’t exist.</p>
                </main>
              } />
          </Routes>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
