import { supabaseServer } from "@/lib/supabaseServer";

/* -------------------------
   ADMIN CHECK (reused)
-------------------------- */
async function requireAdmin() {
const supabase= await supabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not logged in", status: 401 };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Not admin", status: 403 };
  }

  return { user };
}

/* -------------------------
   ADD PRODUCT (POST)
-------------------------- */
export async function POST(req) {
  const body = await req.json();
  const supabase = createClient();

  const admin = await requireAdmin(supabase);
  if (admin.error) {
    return new Response(
      JSON.stringify({ error: admin.error }),
      { status: admin.status }
    );
  }

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("name", body.category)
    .single();

  if (!category) {
    return new Response(
      JSON.stringify({ error: "Invalid category" }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: category.id,
      name: body.name,
      description: body.description,
      specification: body.specification,
      image_url: body.image_url,
      stock: body.stock,
      price: body.price,
    })
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  return Response.json(data);
}

/* -------------------------
   UPDATE PRODUCT (PUT)
-------------------------- */
export async function PUT(req) {
  const body = await req.json();
  const supabase = createClient();

  const admin = await requireAdmin(supabase);
  if (admin.error) {
    return new Response(
      JSON.stringify({ error: admin.error }),
      { status: admin.status }
    );
  }

  if (!body.id) {
    return new Response(
      JSON.stringify({ error: "Product ID required" }),
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: body.name,
      description: body.description,
      specification: body.specification,
      image_url: body.image_url,
      stock: body.stock,
      price: body.price,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  return Response.json(data);
}

/* -------------------------
   DELETE PRODUCT (DELETE)
-------------------------- */
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("id");

  const supabase = createClient();

  const admin = await requireAdmin(supabase);
  if (admin.error) {
    return new Response(
      JSON.stringify({ error: admin.error }),
      { status: admin.status }
    );
  }

  if (!productId) {
    return new Response(
      JSON.stringify({ error: "Product ID required" }),
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}
