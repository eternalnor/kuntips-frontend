const BACKEND = "https://kuntips-backend.eternalnor.workers.dev";
const OG_IMAGE = "https://kuntips.no/KunTips%20Logo%201200x630.png";

// Routes that belong to the SPA — never treat these as creator usernames
const KNOWN_ROUTES = new Set([
  "home", "fans", "legal", "support", "creators",
  "creator-onboarding", "u", "index.html",
]);

const CRAWLER_UA_PATTERNS = [
  "facebookexternalhit",
  "facebot",
  "whatsapp",
  "twitterbot",
  "slackbot",
  "telegrambot",
  "linkedinbot",
  "discordbot",
  "skypeuripreview",
  "pinterest",
  "snapchat",
  "iframely",
  "embedly",
  "outbrain",
  "applebot",
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_PATTERNS.some((p) => ua.includes(p));
}

function buildOgHtml(title, description, pageUrl) {
  return `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="KunTips" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function onRequest({ request, params, env }) {
  const username = params.username;

  // Let the SPA handle all known routes normally
  if (KNOWN_ROUTES.has(username)) {
    return env.ASSETS.fetch(request);
  }

  // Regular visitors — serve the SPA as-is
  const ua = request.headers.get("User-Agent") || "";
  if (!isCrawler(ua)) {
    return env.ASSETS.fetch(request);
  }

  // Crawler — try to fetch creator info from the backend
  const url = new URL(request.url);
  let title = "KunTips";
  let description = "Send tips directly to your favourite creators.";

  try {
    const apiRes = await fetch(`${BACKEND}/creators/${username}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      const name = data?.displayName || data?.username;
      if (name) {
        title = `Tip ${name} on KunTips`;
        description = `Support ${name} directly.`;
      }
    }
  } catch {
    // Fall through to generic tags
  }

  // Fetch index.html and inject OG tags before </head>
  const indexRes = await env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`, { headers: request.headers }),
  );
  const html = await indexRes.text();
  const pageUrl = `${url.origin}/${username}`;
  const injected = html.replace("</head>", `${buildOgHtml(title, description, pageUrl)}\n</head>`);

  return new Response(injected, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
