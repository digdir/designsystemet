export const dynamic = 'force-dynamic';

export async function GET() {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  requestHeaders.set('Authorization', 'Bearer ' + process.env.VERCEL_TOKEN);

  const res = await fetch(
    'https://api.vercel.com/v4/aliases?teamId=' + process.env.VERCEL_TEAM_ID,
    {
      headers: requestHeaders,
      next: { revalidate: 0 },
      cache: 'no-store',
    },
  );
  const data = (await res.json()) as Promise<Response>;
  return Response.json(data);
}
