import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
    const supabase =await supabaseServer()
    const {data:{user}}= await supabase.auth.getUser()
    if(!user){
        return new Response(JSON.stringify({error:"Unauthorized"}),{
            status:401,
            headers:{'Content-Type':'application/json'}
        })
    }
     const { data, error } = await supabase
    .from("wishlist")
    .select(`
      id,
      product_id,
      products(*)
    `)
    .eq("user_id", user.id);
    if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ data });
}