// src/components/TrackingScripts.jsx
// Consent-gated loader for Meta Pixel (fbq) and TikTok Pixel (ttq).
// Nothing loads or fires until the visitor grants marketing consent.
// Pixel IDs come from build-time env vars; no-op if unset.

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { hasMarketingConsent, CONSENT_CHANGE_EVENT } from "../consent.js";

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";
const TIKTOK_PIXEL_ID = import.meta.env.VITE_TIKTOK_PIXEL_ID || "";

// Module-level guard so the base scripts are only injected once per page load.
let pixelsLoaded = false;

function loadMetaPixel() {
  if (!META_PIXEL_ID) return;
  if (window.fbq) return;
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  /* eslint-enable */
  window.fbq("init", META_PIXEL_ID);
}

function loadTikTokPixel() {
  if (!TIKTOK_PIXEL_ID) return;
  if (window.ttq) return;
  /* eslint-disable */
  !(function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++)
      ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t) {
      for (
        var e = ttq._i[t] || [], n = 0;
        n < ttq.methods.length;
        n++
      )
        ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function (e, n) {
      var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var o = d.createElement("script");
      o.type = "text/javascript";
      o.async = !0;
      o.src = i + "?sdkid=" + e + "&lib=" + t;
      var a = d.getElementsByTagName("script")[0];
      a.parentNode.insertBefore(o, a);
    };
    ttq.load(TIKTOK_PIXEL_ID);
  })(window, document, "ttq");
  /* eslint-enable */
}

function firePageView() {
  try {
    if (window.fbq) window.fbq("track", "PageView");
    if (window.ttq) window.ttq.page();
  } catch {
    // ignore
  }
}

export default function TrackingScripts() {
  const location = useLocation();
  const loadedRef = useRef(false);

  // Load (or revoke) pixels based on consent state, reacting to changes.
  useEffect(() => {
    function sync() {
      if (hasMarketingConsent()) {
        if (!pixelsLoaded) {
          loadMetaPixel();
          loadTikTokPixel();
          pixelsLoaded = true;
          loadedRef.current = true;
          firePageView();
        }
      } else if (pixelsLoaded) {
        // Consent withdrawn after load — stop tracking. Full unload needs a
        // reload; we signal revoke and simply stop firing further events.
        try {
          if (window.fbq) window.fbq("consent", "revoke");
        } catch {
          // ignore
        }
        loadedRef.current = false;
      }
    }

    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  // Fire PageView on SPA route changes while pixels are active.
  useEffect(() => {
    if (loadedRef.current && hasMarketingConsent()) {
      firePageView();
    }
  }, [location.pathname, location.search]);

  return null;
}
