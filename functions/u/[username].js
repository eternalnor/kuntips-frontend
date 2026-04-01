// Server-side redirect for old /u/:username links.
// Crawlers don't follow JS redirects, so this ensures they land on the right page.
export async function onRequest({ params }) {
  const username = params.username;
  return new Response(null, {
    status: 301,
    headers: {
      Location: `/${username}`,
    },
  });
}
