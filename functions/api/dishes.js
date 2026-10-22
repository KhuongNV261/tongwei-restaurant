export async function onRequestGet({ env }) {
  try {
    if (!env.DB) {
      return new Response(JSON.stringify({ error: "Chưa cấu hình D1 Database (Binding: DB)" }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const { results } = await env.DB.prepare("SELECT * FROM dishes ORDER BY rowid ASC").all();
    
    // Format boolean and tags array
    const formatted = results.map(d => ({
      id: d.id,
      name: d.name,
      chinese: d.chinese,
      category: d.category,
      categoryName: d.category_name,
      price: d.price,
      image: d.image,
      description: d.description,
      isSignature: d.is_signature === 1,
      isAvailable: d.is_available === 1,
      showOnHome: d.show_on_home === 1,
      spicy: d.spicy || 0,
      tags: d.tags ? d.tags.split(',') : []
    }));

    return new Response(JSON.stringify(formatted), {
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

    const dish = await request.json();
    if (!dish || !dish.id || !dish.name) {
      return new Response(JSON.stringify({ error: "Thiếu dữ liệu món ăn bắt buộc" }), { status: 400 });
    }

    const isSig = dish.isSignature ? 1 : 0;
    const isAvail = dish.isAvailable !== false ? 1 : 0;
    const showHome = dish.showOnHome !== false ? 1 : 0;
    const tagsStr = (dish.tags || []).join(',');

    await env.DB.prepare(`
      INSERT INTO dishes (id, name, chinese, category, category_name, price, image, description, is_signature, is_available, show_on_home, spicy, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        chinese = excluded.chinese,
        category = excluded.category,
        category_name = excluded.category_name,
        price = excluded.price,
        image = excluded.image,
        description = excluded.description,
        is_signature = excluded.is_signature,
        is_available = excluded.is_available,
        show_on_home = excluded.show_on_home,
        spicy = excluded.spicy,
        tags = excluded.tags
    `).bind(
      dish.id,
      dish.name,
      dish.chinese || "",
      dish.category || "dimsum",
      dish.categoryName || dish.category || "Điểm tâm & dimsum",
      dish.price || 0,
      dish.image || "assets/images/dishes/Bánh bao kim sa.png",
      dish.description || "",
      isSig,
      isAvail,
      showHome,
      dish.spicy || 0,
      tagsStr
    ).run();

    return new Response(JSON.stringify({ success: true, message: `Đã lưu món ${dish.name} vào Cloudflare D1!` }), {
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
    });
  }
}
