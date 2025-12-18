import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  try {
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Fetch all orders with their order items and product details in a single query
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        status,
       
        order_items (
          id,
          quantity,
          price_each,
          product:products (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders', details: error.message }), 
        { status: 500 }
      );
    }

    // Transform the data to match the expected format in the frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      created_at: order.created_at,
      status: order.status || 'pending',
      
      order_items: order.order_items?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price_each: item.price_each || 0,
        product: item.product || {
          id: 'unknown',
          name: 'Product not available',
          image_url: null
        }
      })) || []
    }));

    return new Response(JSON.stringify(formattedOrders), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Unexpected error in order route:', err);
    return new Response(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: err.message 
      }), 
      { status: 500 }
    );
  }
}