"use client";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";


export default function AdminDashboard() {
useEffect(() => {
    window.__navbarAlreadyFired = true;
    window.dispatchEvent(new Event('navbarReveal'));

  }, []);
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
    <>
      <Navbar />

      <div className="min-h-screen bg-[#E5E5DD] px-6 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage products and store operations
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* ADD */}
            <button
              onClick={handleAdd}
              className="group p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl text-blue-600 group-hover:scale-110 transition">
                  ＋
                </span>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Product
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  Create and publish new products
                </p>
              </div>
            </button>

            {/* UPDATE */}
            <button
              onClick={handleUpdate}
              className="group p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl text-green-600 group-hover:scale-110 transition">
                  ✎
                </span>
                <h2 className="text-xl font-semibold text-gray-800">
                  Update Product
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  Edit existing product details
                </p>
              </div>
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="group p-8 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all border border-gray-200"
            >
              <div className="flex flex-col items-center gap-4">
                <span className="text-5xl text-red-600 group-hover:scale-110 transition">
                  🗑
                </span>
                <h2 className="text-xl font-semibold text-gray-800">
                  Delete Product
                </h2>
                <p className="text-sm text-gray-500 text-center">
                  Remove products from the store
                </p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
