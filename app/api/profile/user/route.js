import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
    const supabase = await supabaseServer();
    
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError) {
            // If no profile exists, return empty data instead of error
            if (profileError.code === 'PGRST116') {
                return NextResponse.json({
                    id: user.id,
                    email: user.email,
                    name: '',
                    phone: '',
                    created_at: new Date().toISOString()
                });
            }
            throw profileError;
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}