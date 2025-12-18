import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendMail } from "@/lib/mail";  // <-- now using mail.js

export async function POST(req) {
  const supabase =await supabaseServer();

  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(JSON.stringify({ success: false, message: "Missing fields" }), { status: 400 });
    }

  
    // 1️⃣ Verify Razorpay Signature
    
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await supabase
        .from("orders")
        .update({ status: "signature_verification_failed" })
        .eq("razorpay_order_id", razorpay_order_id);

      return new Response(JSON.stringify({ success: false, message: "Invalid signature" }), { status: 400 });
    }

    // 2️⃣ Fetch Order + Items + User Email
  
    const { data: order } = await supabase
      .from("orders")
      .select("id, user_id,email, total, created_at")
      .eq("razorpay_order_id", razorpay_order_id)
      .single();

    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity, price_each, name")
      .eq("order_id", order.id);

    // fetch user email from auth admin API
    

    const userEmail = order.email;
    const adminEmail = process.env.ADMIN_EMAIL;

   
    // 3️⃣ Mark Order Completed
  
    await supabase
      .from("orders")
      .update({
        status: "completed",
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("razorpay_order_id", razorpay_order_id);

    
    // 4️⃣ Build Email HTML Template
    
    const itemHtml = items
      .map(
        (it) => `
          <p>
            <b>Product ID:</b> ${it.product_id}<br/>
            <b> Product Name:</b> ${it.name}<br/>
            <b>Qty:</b> ${it.quantity}<br/>
            <b>Price:</b> ₹${it.price_each}
            
          </p>
        `
      )
      .join("");

    const emailHtml = `
      <h2>Order Confirmed 🎉</h2>

      <p><b>Order ID:</b> ${order.id}</p>
      <p><b>Payment ID:</b> ${razorpay_payment_id}</p>
      <p><b>Total:</b> ₹${order.total}</p>

      <h3>Items:</h3>
      ${itemHtml}

      <p><b>Order Date:</b> ${order.created_at}</p>
    `;

    
    if (userEmail) {
      await sendMail({
        to: userEmail,
        subject: "Your Order is Confirmed",
        html: emailHtml,
      });
    }

    
    // 6️⃣ Send Email to Admin
  
    await sendMail({
      to: adminEmail,
      subject: "New Order Received",
      html: `
        <h2>New Order Placed</h2>
        ${emailHtml}
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("verify error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
