export async function POST() {
  // For marketplace listing only - not actually used
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
