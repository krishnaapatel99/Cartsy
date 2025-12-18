import { createClient } from "@/lib/supabaseServer";


export async function POST(req) {
    const body=await req.json()
     const supabase= createClient()
    const {data:user}= await supabase.auth.getUser()

    if(!user){
         return new Response(JSON.stringify({ error: "Not logged in" }), { status: 401 });
    }

    const {data:profile} = await supabase
    .from("profiles")
    .select("role")
    .eq("id",user.id)
    .single();

    if(profile.role!="admin"){
          return new Response(JSON.stringify({ error: "Not admin" }), { status: 403 });
    }
    
    const {data:category,error:category_error}= await supabase
    .from("categories")
    .select("id")
    .eq("name",body.category)
    .single()

if (category_error || !category) {
    return new Response(JSON.stringify({ error: "Invalid category" }), { status: 400 });
  }
  const {data, error}=await supabase
  .from("products")
  .insert(
    {category_id:category.id,
    name:body.name,
    description:body.description,
    specification:body.specification,
    image_url:image_url,
    stock:stock,
    price:body.price})
    .select()
    .single()

     if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return Response.json(data);
}