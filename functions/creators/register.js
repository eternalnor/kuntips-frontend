const BACKEND = "https://kuntips-backend.eternalnor.workers.dev";
const OG_IMAGE = "https://kuntips.no/og-image.png";

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

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

export async function onRequest({ request, env }) {
  const ua = request.headers.get("User-Agent") || "";
  if (!isCrawler(ua)) {
    return env.ASSETS.fetch(request);
  }

  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");

  let title = "Join KunTips as a creator";
  let description = "Sign up and get a free tier boost for your first 30 days.";

  if (ref) {
    let name = ref;
    try {
      const apiRes = await fetch(`${BACKEND}/creators/${ref}`);
      if (apiRes.ok) {
        const data = await apiRes.json();
        name = data?.displayName || data?.username || ref;
      }
    } catch {
      // Fall through to username as name
    }

    title = `${name} invited you to KunTips`;
    description = `Sign up through this link and get a free tier boost for your first 30 days as a creator.`;
  }

  const indexRes = await env.ASSETS.fetch(
    new Request(`${url.origin}/index.html`, { headers: request.headers }),
  );
  let html = await indexRes.text();

  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, "");
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, "");

  const injected = html.replace("</head>", `${buildOgHtml(title, description, url.href)}\n</head>`);

  return new Response(injected, {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
