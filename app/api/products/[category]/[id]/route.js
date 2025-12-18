import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
    const { category, id } = await params;   

    try {
        const supabase =await supabaseServer();

        // 1️⃣ First check category exists
        const { data: catData, error: catError } = await supabase
            .from("categories")
            .select("id")
            .eq("name", category)
            .single();

        if (catError || !catData) {
            return new Response(
                JSON.stringify({ error: "Category not found" }),
                { status: 404 }
            );
        }

        // 2️⃣ Fetch product by id AND category
        const { data: product, error: productError } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .eq("category_id", catData.id)   // <-- Ensures product belongs to this category
            .single();

        if (productError || !product) {
            return new Response(
                JSON.stringify({ error: "Product not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ product }),
            { status: 200 }
        );
    }

    catch (err) {
        return new Response(
            JSON.stringify({ error: err.message || "Internal server error" }),
            { status: 500 }
        );
    }
}
