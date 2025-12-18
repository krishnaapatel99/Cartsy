import { razorpay } from "@/lib/razorpay";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase =await supabaseServer();
  try {
    const body = await req.json();
    const {data: {user}}= await supabase.auth.getUser();
    const userEmail=user.email;
    const userId= user.id;
    const {  items = [], notes = {} } = body;

    if (!userId) return new Response(JSON.stringify({ error: "userId required" }), { status: 400 });

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "cart items required" }), { status: 400 });
    }

   
    const total = items.reduce((sum, it) => {
      const p = Number(it.price_each ?? 0);
      const q = Number(it.quantity ?? 0);
      return sum + (p * q);
    }, 0);

    if (total <= 0) {
      return new Response(JSON.stringify({ error: "invalid total" }), { status: 400 });
    }

    // Create Razorpay instance
    
    // amount must be in paise
    const options = {
      amount: Math.round(total * 100), // convert rupees to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1, // auto-capture
      notes,
    };

    const rzpOrder = await razorpay.orders.create(options);

    if (!rzpOrder || !rzpOrder.id) {
      throw new Error("Failed to create razorpay order");
    }

    // Insert order + items in Supabase (service role)
    const { data: orderInsert, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email:userEmail,
        total,
        status: "pending",
        razorpay_order_id: rzpOrder.id,
      })
      .select("id")
      .single();

    if (orderErr) throw orderErr;

    const orderId = orderInsert.id;

    // Prepare order_items rows
    const itemsToInsert = items.map((it) => ({
      order_id: orderId,
      name:it.name,
      product_id: it.product_id,
      quantity: it.quantity,
      price_each: it.price_each,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(itemsToInsert);
    if (itemsErr) throw itemsErr;

    return new Response(JSON.stringify({
      success: true,
      razorpay_order_id: rzpOrder.id,
      order_id: orderId,
      amount: total
    }), { status: 200 });
  } catch (err) {
    console.error("create-order error:", err);
    return new Response(JSON.stringify({ error: err.message || err }), { status: 500 });
  }
}
