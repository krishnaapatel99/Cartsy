import {  supabaseServer } from "@/lib/supabaseServer";

export async function get(userId){
   console.log(userId)
    const supabase=await supabaseServer();
   
    const {data: cart, error:cart_Error}=await supabase
    .from("carts")
    .select("*")
    .eq("user_id",userId)
    .eq("status", "active")
    .single()

    if(cart) return cart.id

    const {data: newcart, error:newcart_Error}=await supabase
    .from("carts")
    .insert({
        user_id:userId,
        status:"active"
    })
    .select("*")
    .single()
    if(newcart_Error){
       
        throw new Error("Cart not found")
    }
    return newcart.id;
}