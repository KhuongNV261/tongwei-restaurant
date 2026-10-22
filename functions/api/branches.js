export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database" }), { status: 500 });
    }
    const { results } = await env.DB.prepare("SELECT * FROM branches ORDER BY id ASC").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
