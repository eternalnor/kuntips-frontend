import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function WelcomePage() {

const bgRef = useRef(null);

useEffect(() => {
  const el = bgRef.current;
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  let raf = 0;
  let t = 0;

  // Mouse influence (you were missing this constant)
  const MOUSE_AMPLITUDE = 12; // px (keep subtle + premium)

  // Travel speeds (controls how fast the glow centers move across)
  const SPEED_X1 = 0.055;
  const SPEED_X2 = 0.035;

  // Vertical drift speeds
  const SPEED_Y1 = 0.020;
  const SPEED_Y2 = 0.017;

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
      <main className="welcome-stage">
        <div ref={bgRef} className="welcome-bg" aria-hidden="true"/>


        <section className="welcome-hero welcome-hero-animate">
          <h1 className="welcome-title">Welcome to KunTips</h1>
          <p className="welcome-sub">
            One-time tips, powered by Stripe. No fan accounts. No feed. Just a clean tip flow.
          </p>
        </section>

        <section className="welcome-choices welcome-choices-animate">
          <Link to="/fans" className="welcome-choice-card welcome-choice-card--fan">
            <div className="welcome-choice-card__inner">
              <div className="welcome-choice-card__eyebrow">For fans</div>
              <div className="welcome-choice-card__title">Send a tip</div>
              <div className="welcome-choice-card__desc">
                Pick an amount and pay securely. Fast, private, simple.
              </div>

              <div className="welcome-choice-card__cta">
                <span className="welcome-choice-card__cta-pill">Continue</span>
                <span className="welcome-choice-card__cta-arrow">→</span>
              </div>
            </div>
          </Link>

          <Link to="/creators" className="welcome-choice-card welcome-choice-card--creator">
            <div className="welcome-choice-card__inner">
              <div className="welcome-choice-card__eyebrow">For creators</div>
              <div className="welcome-choice-card__title">Receive tips</div>
              <div className="welcome-choice-card__desc">
                Connect Stripe once and share your KunTips link.
              </div>

              <div className="welcome-choice-card__cta">
                <span className="welcome-choice-card__cta-pill">Continue</span>
                <span className="welcome-choice-card__cta-arrow">→</span>
              </div>
            </div>
          </Link>
        </section>

        <section className="welcome-more-section">
          <Link to="/home" className="welcome-more-bar">
            <span className="welcome-more-bar__label">More info</span>
            <span className="welcome-more-bar__hint">How KunTips works</span>
            <span className="welcome-more-bar__arrow">→</span>
          </Link>

          <p className="welcome-more-note">
            Or scroll to see a quick breakdown.
          </p>
        </section>

        <section className="welcome-info" id="welcome-info">
          <div className="welcome-info-grid">
            <div className="card welcome-info-card">
              <h2>For fans</h2>
              <p>
                Open a creator link, choose an amount, pay securely. No KunTips account.
              </p>
            </div>

            <div className="card welcome-info-card">
              <h2>For creators</h2>
              <p>
                Connect Stripe once and share your KunTips link anywhere.
              </p>
            </div>

            <div className="card welcome-info-card">
              <h2>Privacy & payouts</h2>
              <p>
                Stripe processes payments. KunTips keeps data collection minimal.
              </p>
            </div>
          </div>
        </section>

      </main>
  );
}
