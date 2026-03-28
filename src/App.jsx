import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import CreatorPage from "./pages/CreatorPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import CookiesPage from "./pages/CookiesPage.jsx";
import CreatorAgreementPage from "./pages/CreatorAgreementPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";
import Footer from "./components/Footer.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import CreatorsLanding from "./CreatorsLanding";
import CreatorsStart from "./CreatorsStart";
import CreatorsDashboard from "./CreatorsDashboard";
import CreatorOnboardingSuccess from "./CreatorOnboardingSuccess";
import CreatorOnboardingError from "./CreatorOnboardingError";
import CreatorLogin from "./CreatorLogin";
import CreatorsRegister from "./CreatorsRegister";
import WelcomePage from "./pages/WelcomePage.jsx";
import FansPage from "./pages/FansPage.jsx";


function AppRoutes() {
  const location = useLocation();

  // This is the location the UI is currently showing
  const [displayLocation, setDisplayLocation] = useState(location);

  // fadeIn / fadeOut for the wrapper
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    // If the actual location changed, start fade out
    if (
      location.pathname === displayLocation.pathname &&
      location.search === displayLocation.search
    ) {
      return;
    }

    setTransitionStage("fadeOut");

    const timeout = setTimeout(() => {
      // After fade-out, switch the displayed location and fade in
      setDisplayLocation(location);
      setTransitionStage("fadeIn");
    }, 200); // match CSS timing

    return () => clearTimeout(timeout);
  }, [location, displayLocation]);

  return (
    <div className="app-main">
      <div className={`page-transition page-transition--${transitionStage}`}>
        <Routes location={displayLocation}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/fans" element={<FansPage />} />
          <Route path="/u/:username" element={<CreatorPage />} />
          <Route path="/legal/terms" element={<TermsPage />} />
          <Route path="/legal/privacy" element={<PrivacyPage />} />
          <Route path="/legal/cookies" element={<CookiesPage />} />
          <Route
            path="/legal/creator-agreement"
            element={<CreatorAgreementPage />}
          />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/creators" element={<CreatorsLanding />} />
          <Route path="/creators/start" element={<CreatorsStart />} />
          <Route path="/creators/register" element={<CreatorsRegister />} />
          <Route path="/creators/login" element={<CreatorLogin />} />
          <Route path="/creators/dashboard" element={<CreatorsDashboard />} />
          <Route
            path="/creator-onboarding/success"
            element={<CreatorOnboardingSuccess />}
          />
          <Route
            path="/creator-onboarding/error"
            element={<CreatorOnboardingError />}
          />

          <Route
            path="*"
            element={
              <main className="page-legal">
                <h1 className="page-title">Page not found</h1>
                <p>The page you’re looking for doesn’t exist.</p>
              </main>
            }
          />
        </Routes>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  const bgRef = useRef(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const MOUSE_AMPLITUDE = 12;

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty("--mouse-x", `${x * MOUSE_AMPLITUDE}px`);
      el.style.setProperty("--mouse-y", `${y * MOUSE_AMPLITUDE}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="app-root">
      {/* Global animated background — 4 wave SVGs, each 200vw wide for seamless loop */}
      <div ref={bgRef} className="site-bg" aria-hidden="true">
        {/* Wave 1 — indigo, medium amplitude, 3 cycles/viewport */}
        <svg className="site-wave-svg site-wave-svg--1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <path d="M0,160 C160,95 320,225 480,160 C640,95 800,225 960,160 C1120,95 1280,225 1440,160 C1600,95 1760,225 1920,160 C2080,95 2240,225 2400,160 C2560,95 2720,225 2880,160" />
        </svg>
        {/* Wave 2 — cyan, large amplitude, 2 cycles/viewport */}
        <svg className="site-wave-svg site-wave-svg--2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <path d="M0,430 C240,325 480,535 720,430 C960,325 1200,535 1440,430 C1680,325 1920,535 2160,430 C2400,325 2640,535 2880,430" />
        </svg>
        {/* Wave 3 — faint indigo, small amplitude, 4 cycles/viewport */}
        <svg className="site-wave-svg site-wave-svg--3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <path d="M0,660 C120,615 240,705 360,660 C480,615 600,705 720,660 C840,615 960,705 1080,660 C1200,615 1320,705 1440,660 C1560,615 1680,705 1800,660 C1920,615 2040,705 2160,660 C2280,615 2400,705 2520,660 C2640,615 2760,705 2880,660" />
        </svg>
        {/* Wave 4 — barely-visible white, crosses mid-screen */}
        <svg className="site-wave-svg site-wave-svg--4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <path d="M0,300 C160,220 320,380 480,300 C640,220 800,380 960,300 C1120,220 1280,380 1440,300 C1600,220 1760,380 1920,300 C2080,220 2240,380 2400,300 C2560,220 2720,380 2880,300" />
        </svg>
      </div>

      <div className="app-shell">
        <SiteHeader />
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
