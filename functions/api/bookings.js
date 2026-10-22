export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database (Binding: DB)" }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const { results } = await env.DB.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database (Binding: DB)" }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const b = await request.json();
    if (!b || !b.name || !b.phone) {
      return new Response(JSON.stringify({ error: "Vui lòng nhập họ tên và số điện thoại liên hệ" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const bookingId = b.id || `TB-${Math.floor(100 + Math.random() * 900)}`;

    await env.DB.prepare(`
      INSERT INTO bookings (id, name, phone, date, time, guests, branch, area, pre_order, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      bookingId,
      b.name,
      b.phone,
      b.date || new Date().toISOString().split('T')[0],
      b.time || "18:30",
      b.guests || "4 Khách",
      b.branch || "Cơ sở 1 (Hoàn Kiếm)",
      b.area || "Sảnh tiêu chuẩn",
      b.preOrder || b.pre_order || "Không gọi trước",
      b.status || "pending"
    ).run();

    return new Response(JSON.stringify({
      success: true,
      bookingId,
      message: `Quý khách đã đặt bàn thành công tại TongWei! Mã đặt bàn: ${bookingId}`
    }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  }
}

export async function onRequestPatch({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database" }), { status: 500 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return new Response(JSON.stringify({ error: "Thiếu ID hoặc trạng thái cập nhật" }), { status: 400 });
    }

    await env.DB.prepare("UPDATE bookings SET status = ? WHERE id = ?").bind(status, id).run();

    return new Response(JSON.stringify({ success: true, message: `Đã cập nhật trạng thái đơn ${id} thành ${status}` }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
