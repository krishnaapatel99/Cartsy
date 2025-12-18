import { supabaseServer } from "@/lib/supabaseServer"

export async function GET(req) {
    try {
        const supabase = await supabaseServer();
        const { data: { user }, error: user_error } = await supabase.auth.getUser()

        if (user_error || !user) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Get user's address
        const { data: address, error: address_error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()
       
        // Get user's cart
        const { data: cart, error: cart_error } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single()

        if (!cart) {
            return Response.json({ 
          
                cart_orders: [] 
            })
        }

        // Get cart items with product details
        const { data: cart_orders, error: cart_orders_error } = await supabase
            .from("cart_items")
            .select(`
                *,
                product:products (
                    name,
                    price,
                    image_url
                )
            `)
            .eq("cart_id", cart.id)

           

        if (cart_orders_error) throw cart_orders_error

        return Response.json({ 
            address: address , 
            cart_orders: cart_orders || [] 
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}