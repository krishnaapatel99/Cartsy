import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
    const supabase =await supabaseServer();
  const {data:{user}} = await supabase.auth.getUser();
 if(!user){
        return new Response(JSON.stringify({error:"Unauthorized"}),{
            status:401,
            headers:{'Content-Type':'application/json'}
        })
    }


  try {
    // Get active cart
    const { data: cart, error: cartError } =await supabase
      .from("carts")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!cart || cartError) {
      return Response.json({ cart: null, items: [] });
    }

    const { data: items, error: itemError } =await supabase
      .from("cart_items")
      .select(`
        *,
        products(*)
      `)
      .eq("cart_id", cart.id);

    return Response.json({
      cart,
      items
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
