import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { productId } = await req.json();
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Product ID is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = await supabaseServer();
    const { data: {user}, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Please log in to add to wishlist" }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if product is already in wishlist
    const { data: existingItem, error: checkError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (checkError) throw checkError;
    
    let result;
    
    if (existingItem) {
      // Remove from wishlist if already exists (toggle behavior)
      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existingItem.id);

      if (deleteError) throw deleteError;
      
      result = { 
        action: "removed", 
        success: true, 
        message: "Removed from wishlist" 
      };
    } else {
      // Add to wishlist if not exists
      const { data: newItem, error: insertError } = await supabase
        .from("wishlist")
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select(`
          id,
          product_id,
          created_at,
          products(*)
        `)
        .single();

      if (insertError) throw insertError;
      
      result = { 
        action: "added", 
        success: true, 
        message: "Added to wishlist",
        data: newItem 
      };
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Wishlist operation failed:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to update wishlist",
        details: error.details || null
      }), 
      { status: error.status || 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}