export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database (Binding: DB)" }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // Tự động thêm cột end_date nếu bảng chưa có (Migration an toàn)
    try {
      await env.DB.prepare("ALTER TABLE events ADD COLUMN end_date TEXT").run();
    } catch (e) {}

    const { results } = await env.DB.prepare("SELECT * FROM events ORDER BY id DESC").all();
    return new Response(JSON.stringify(results || []), {
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

    // Tự động thêm cột end_date nếu bảng chưa có
    try {
      await env.DB.prepare("ALTER TABLE events ADD COLUMN end_date TEXT").run();
    } catch (e) {}

    const ev = await request.json();
    if (!ev || !ev.title) {
      return new Response(JSON.stringify({ error: "Tiêu đề sự kiện không được để trống" }), { status: 400 });
    }

    const id = ev.id ? Number(ev.id) : Date.now();
    const title = ev.title;
    const date = ev.date || "";
    const endDate = ev.end_date || ev.endDate || "";
    const badge = ev.badge || "Sự Kiện";
    const img = ev.img || "assets/images/branding/tv_tongwei_nguyen_thi_thap.jpg";
    const desc = ev.desc || "";
    const detail = ev.detail || "";
    const status = ev.status || "active";

    await env.DB.prepare(`
      INSERT INTO events (id, title, date, end_date, badge, img, "desc", detail, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        date = excluded.date,
        end_date = excluded.end_date,
        badge = excluded.badge,
        img = excluded.img,
        "desc" = excluded."desc",
        detail = excluded.detail,
        status = excluded.status
    `).bind(id, title, date, endDate, badge, img, desc, detail, status).run();

    return new Response(JSON.stringify({
      success: true,
      event: { id, title, date, end_date: endDate, badge, img, desc, detail, status },
      message: `Đã lưu sự kiện "${title}" thành công vào Database!`
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

    await env.DB.prepare(`UPDATE events SET status = ? WHERE id = ?`).bind(status, id).run();

    return new Response(JSON.stringify({
      success: true,
      message: `Đã cập nhật trạng thái sự kiện ID ${id} thành "${status}"`
    }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database" }), { status: 500 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Thiếu ID sự kiện cần xóa" }), { status: 400 });
    }

    await env.DB.prepare("DELETE FROM events WHERE id = ?").bind(id).run();

    return new Response(JSON.stringify({ success: true, message: `Đã xóa sự kiện ID ${id}` }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
