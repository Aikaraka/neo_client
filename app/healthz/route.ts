export const dynamic = 'force-static';
export const revalidate = 0;

export async function GET() {
  return new Response('ok', {
    status: 200,
    headers: { 
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain'
    },
  });
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: { 
      'Cache-Control': 'no-store'
    },
  });
}


