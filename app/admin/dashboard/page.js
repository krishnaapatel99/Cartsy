"use client";

export default function AdminDashboard() {

  // ADD PRODUCT
  async function handleAdd() {
    const res = await fetch("/api/admin/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Product",
        category: "Shoes",
        description: "Demo product",
        specification: "Demo specs",
        image_url: "https://example.com/image.png",
        stock: 10,
        price: 1999,
      }),
    });

    const data = await res.json();
    console.log("ADD:", data);
    alert(res.ok ? "Product Added" : data.error);
  }

  // UPDATE PRODUCT
  async function handleUpdate() {
    const res = await fetch("/api/admin/add", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1, // existing product ID
        name: "Updated Product",
        description: "Updated description",
        specification: "Updated specs",
        image_url: "https://example.com/new.png",
        stock: 5,
        price: 2499,
      }),
    });

    const data = await res.json();
    console.log("UPDATE:", data);
    alert(res.ok ? "Product Updated" : data.error);
  }

  // DELETE PRODUCT
  async function handleDelete() {
    const res = await fetch("/api/admin/add?id=1", {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("DELETE:", data);
    alert(res.ok ? "Product Deleted" : data.error);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="grid gap-8 w-full max-w-xl px-6">

        {/* ADD PRODUCT */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-4 h-24 rounded-2xl bg-black text-white text-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          <span className="text-3xl">＋</span>
          Add Product
        </button>

        {/* UPDATE PRODUCT */}
        <button
          onClick={handleUpdate}
          className="flex items-center justify-center gap-4 h-24 rounded-2xl bg-[#1f2937] text-white text-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          <span className="text-3xl">✎</span>
          Update Product
        </button>

        {/* DELETE PRODUCT */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-4 h-24 rounded-2xl bg-red-600 text-white text-2xl font-semibold shadow-lg hover:scale-[1.02] transition"
        >
          <span className="text-3xl">🗑</span>
          Delete Product
        </button>

      </div>
    </div>
  );
}
