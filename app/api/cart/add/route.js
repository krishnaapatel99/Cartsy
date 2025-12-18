import { supabaseServer } from "@/lib/supabaseServer";
import { get } from "@/app/api/cart/get";

export async function POST(req) {
  try {
    // Initialize Supabase client
    const supabase =await supabaseServer();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Check if user is authenticated
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please sign in to add items to cart' }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get cart ID for the user
    const cartId = await get(user.id);
    
    // Parse request body
    const { productId, quantity, price_at_add } = await req.json();
    
    // Validate required fields
    if (!productId || !quantity) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productId and quantity are required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add item to cart
    const { data: cartItem, error: insertError } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: productId,
        quantity: Number(quantity),
        price_at_add: price_at_add ? Number(price_at_add) : null,
       
      })
      .select()
      .single();

    // Handle insert errors
    if (insertError) {
      console.error('Error adding to cart:', insertError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to add item to cart',
          details: insertError.message 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify(cartItem),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error in add to cart:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}