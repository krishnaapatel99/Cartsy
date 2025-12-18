import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
    const { category } =await params;

    try {
        const supabase =await supabaseServer();
        
        const { data: cat, error: cat_error } = await supabase
            .from("categories")
            .select("id")
            .eq("name", category)
            .single();

        if (cat_error || !cat) {
            return new Response(JSON.stringify({ error: "Category not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch all products in the category with pagination
        let allProducts = [];
        let page = 0;
        const pageSize = 100; // Maximum page size in Supabase
        let hasMore = true;
        
        while (hasMore) {
            const { data: products, error: products_error, count } = await supabase
                .from("products")
                .select("*", { count: 'exact' })
                .eq("category_id", cat.id)
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (products_error) {
                throw products_error;
            }

            allProducts = [...allProducts, ...products];
            
            // Check if we've fetched all products
            if (!products.length || products.length < pageSize) {
                hasMore = false;
            } else {
                page++;
            }
        }

        return new Response(JSON.stringify(allProducts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ 
            error: error.message || 'Internal server error' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}