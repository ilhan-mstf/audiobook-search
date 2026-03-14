export async function onRequest(context: { request: Request }): Promise<Response> {
  const url = new URL(context.request.url)
  const params = url.searchParams.toString()

  const upstream = await fetch(
    `https://librivox.org/api/feed/audiobooks/?${params}`,
    { headers: { 'User-Agent': 'audiobook-search/1.0' } }
  )

  const body = await upstream.text()

  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
