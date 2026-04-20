import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";

// HomePage removed — content merged into FansPage and CreatorsLanding
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
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminCreators from "./pages/admin/AdminCreators.jsx";
import AdminCreatorDetail from "./pages/admin/AdminCreatorDetail.jsx";
import AdminPlatformEvents from "./pages/admin/AdminPlatformEvents.jsx";
import AdminReferralCodes from "./pages/admin/AdminReferralCodes.jsx";


function RedirectToUsername() {
  const { username } = useParams();
  return <Navigate to={`/${username}`} replace />;
}

function AppRoutes({ isAdminRoute }) {
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
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/fans" element={<FansPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="creators" element={<AdminCreators />} />
            <Route path="creators/:id" element={<AdminCreatorDetail />} />
            <Route path="platform-events" element={<AdminPlatformEvents />} />
            <Route path="referral-codes" element={<AdminReferralCodes />} />
          </Route>
          <Route path="/u/:username" element={<RedirectToUsername />} />
          <Route path="/:username" element={<CreatorPage />} />
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
          <Route path="/creators/verify-email" element={<VerifyEmailPage />} />
          <Route path="/creators/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/creators/reset-password" element={<ResetPasswordPage />} />
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

        {!isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={"app-shell" + (isAdminRoute ? " app-shell--admin" : "")}>
      {!isAdminRoute && <SiteHeader />}
      <AppRoutes isAdminRoute={isAdminRoute} />
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

  // Scale animation durations with viewport width so the wave pixel-speed
  // stays constant regardless of screen size. BASE_WIDTH is the mobile
  // reference viewport (390 px) where the hand-tuned durations feel right.
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const BASE_WIDTH = 390;
    const BASE_DURATIONS = [32, 44, 22, 36, 50]; // wave 1-5

    const updateDurations = () => {
      const ratio = window.innerWidth / BASE_WIDTH;
      BASE_DURATIONS.forEach((dur, i) => {
        el.style.setProperty(`--wave-dur-${i + 1}`, `${(dur * ratio).toFixed(1)}s`);
      });
    };

    updateDurations();
    window.addEventListener("resize", updateDurations, { passive: true });
    return () => window.removeEventListener("resize", updateDurations);
  }, []);

  return (
    <div className="app-root">
      {/* Global animated background — gradient wave bands sweeping left */}
      <div ref={bgRef} className="site-bg" aria-hidden="true">

        {/* Wave 1 — indigo pair, upper, double-swell */}
        <svg className="site-wave-svg site-wave-svg--1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity="0"/>
              <stop offset="7%"   stopColor="#6366f1" stopOpacity="0.9"/>
              <stop offset="35%"  stopColor="#6366f1" stopOpacity="0.6"/>
              <stop offset="60%"  stopColor="#6366f1" stopOpacity="0.85"/>
              <stop offset="92%"  stopColor="#6366f1" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* main line */}
          <path stroke="url(#wg1)" d="M0,190 C180,70 540,310 720,190 C900,70 1260,310 1440,190 C1620,70 1980,310 2160,190 C2340,70 2700,310 2880,190" />
          {/* companion — offset 14px below, thinner, dimmer */}
          <path stroke="url(#wg1)" strokeWidth="0.75" opacity="0.45" d="M0,204 C180,84 540,324 720,204 C900,84 1260,324 1440,204 C1620,84 1980,324 2160,204 C2340,84 2700,324 2880,204" />
        </svg>

        {/* Wave 2 — cyan hairline, mid-upper, grand single swell */}
        <svg className="site-wave-svg site-wave-svg--2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0"/>
              <stop offset="9%"   stopColor="#38bdf8" stopOpacity="0.85"/>
              <stop offset="42%"  stopColor="#38bdf8" stopOpacity="0.55"/>
              <stop offset="65%"  stopColor="#38bdf8" stopOpacity="0.80"/>
              <stop offset="91%"  stopColor="#38bdf8" stopOpacity="0.50"/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path stroke="url(#wg2)" d="M0,330 C360,245 1080,415 1440,330 C1800,245 2520,415 2880,330" />
        </svg>

        {/* Wave 3 — lavender hairline, centre, quick triple ripples */}
        <svg className="site-wave-svg site-wave-svg--3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#e0e7ff" stopOpacity="0"/>
              <stop offset="8%"   stopColor="#e0e7ff" stopOpacity="0.75"/>
              <stop offset="40%"  stopColor="#e0e7ff" stopOpacity="0.45"/>
              <stop offset="62%"  stopColor="#e0e7ff" stopOpacity="0.70"/>
              <stop offset="93%"  stopColor="#e0e7ff" stopOpacity="0.40"/>
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path stroke="url(#wg3)" d="M0,470 C120,405 360,535 480,470 C600,405 840,535 960,470 C1080,405 1320,535 1440,470 C1560,405 1800,535 1920,470 C2040,405 2280,535 2400,470 C2520,405 2760,535 2880,470" />
        </svg>

        {/* Wave 4 — indigo pair, mid-lower, double-swell */}
        <svg className="site-wave-svg site-wave-svg--4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity="0"/>
              <stop offset="6%"   stopColor="#6366f1" stopOpacity="0.92"/>
              <stop offset="38%"  stopColor="#6366f1" stopOpacity="0.58"/>
              <stop offset="63%"  stopColor="#6366f1" stopOpacity="0.88"/>
              <stop offset="94%"  stopColor="#6366f1" stopOpacity="0.50"/>
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* main line */}
          <path stroke="url(#wg4)" d="M0,610 C180,510 540,710 720,610 C900,510 1260,710 1440,610 C1620,510 1980,710 2160,610 C2340,510 2700,710 2880,610" />
          {/* companion — offset 14px above, thinner, dimmer */}
          <path stroke="url(#wg4)" strokeWidth="0.75" opacity="0.45" d="M0,596 C180,496 540,696 720,596 C900,496 1260,696 1440,596 C1620,496 1980,696 2160,596 C2340,496 2700,696 2880,596" />
        </svg>

        {/* Wave 5 — cyan pair, lower, grand single swell */}
        <svg className="site-wave-svg site-wave-svg--5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2880 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wg5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0"/>
              <stop offset="8%"   stopColor="#38bdf8" stopOpacity="0.80"/>
              <stop offset="44%"  stopColor="#38bdf8" stopOpacity="0.50"/>
              <stop offset="68%"  stopColor="#38bdf8" stopOpacity="0.75"/>
              <stop offset="92%"  stopColor="#38bdf8" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* main line */}
          <path stroke="url(#wg5)" d="M0,740 C360,670 1080,810 1440,740 C1800,670 2520,810 2880,740" />
          {/* companion — offset 10px below, thinner, dimmer */}
          <path stroke="url(#wg5)" strokeWidth="0.7" opacity="0.4" d="M0,750 C360,680 1080,820 1440,750 C1800,680 2520,820 2880,750" />
        </svg>

      </div>

      <AppLayout />
    </div>
  );
}

export default App;
