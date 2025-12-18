import {supabaseServer} from "@/lib/supabaseServer"

export async function POST(req){

    const supabase =await supabaseServer();
    const {full_name, phone, address_line1, address_line2, city, state, postal_code, country  }=await req.json();
    const {data:{user}, error:user_error}= await supabase.auth.getUser();
    if(user_error){
        return Response.json({error:user_error}, {status:401})
    }
    const {data:address, error:address_error} = await supabase
    .from("addresses")
    .upsert({
        user_id:user.id,
        full_name,
        phone,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        updated_at: new Date().toISOString()
    },)

      if(address_error){
        return Response.json({error: address_error.message}, {status:400})
      }

      return Response.json({success:true})
    
    
    
}