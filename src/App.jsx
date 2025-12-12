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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let raf = 0;
    let t = 0;

    // travel speeds
    const SPEED_X1 = 0.055;
    const SPEED_X2 = 0.035;

    // vertical drift speeds
    const SPEED_Y1 = 0.020;
    const SPEED_Y2 = 0.017;

    const MOUSE_AMPLITUDE = 12;

    const updateAutoFlow = () => {
      t += 0.9;

      const x1 = (t * SPEED_X1) % 100;
      const x2 = (20 + t * SPEED_X2) % 100;

      const y1 = 28 + Math.sin(t * SPEED_Y1) * 10;
      const y2 = 70 + Math.cos(t * SPEED_Y2) * 10;

      el.style.setProperty("--g1x", `${x1}%`);
      el.style.setProperty("--g1y", `${y1}%`);
      el.style.setProperty("--g2x", `${x2}%`);
      el.style.setProperty("--g2y", `${y2}%`);

      raf = requestAnimationFrame(updateAutoFlow);
    };

    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      el.style.setProperty("--mouse-x", `${x * MOUSE_AMPLITUDE}px`);
      el.style.setProperty("--mouse-y", `${y * MOUSE_AMPLITUDE}px`);
    };

    updateAutoFlow();
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="app-root">
      {/* Global animated background behind the entire site */}
      <div ref={bgRef} className="site-bg" aria-hidden="true" />

      <div className="app-shell">
        <SiteHeader />
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
