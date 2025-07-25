"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "./UserContext";
export default function Home() {

  const listingsRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { current_user_id, current_user_name, current_user_email } = useUser();

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("Items")
        .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name, user_email");
      if (!error) setItems(data || []);
      setLoading(false);
    }
    fetchItems();
  }, []);

  return (
  
     <section className="flex flex-col items-center justify-center gap-8 py-16">
      <title>UNC Marketplace</title>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          {current_user_name ? `${current_user_name}, Welcome to UNC Marketplace!` : "Welcome to UNC Marketplace!"}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The easiest way for UNC students to buy and sell dorm essentials, supplies, textbooks, clothes, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            className="bg-blue-300 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500 transition"
            onClick={() => {
              listingsRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Browse Listings
          </button>
          <Link href="/post-item" className="bg-white border border-blue-300 text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition">Post an Item</Link>
        </div>
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8"
      >
        <Link href="/category/dorm-stuff" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Dorm Stuff</h2>
          <p className="text-gray-600 text-sm">Beds, mini-fridges, decor, and more for your dorm room.</p>
        </Link>
        <Link href="/category/supplies" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Supplies</h2>
          <p className="text-gray-600 text-sm">School and study supplies, electronics, and more.</p>
        </Link>
        <Link href="/category/class-materials" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Class Materials</h2>
          <p className="text-gray-600 text-sm">Buy or sell class notes and textbooks for your UNC classes.</p>
        </Link>
        <Link href="/category/clothes" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Clothes</h2>
          <p className="text-gray-600 text-sm">UNC gear, seasonal wear, and more clothing items.</p>
        </Link>
        <Link href="/category/electronics" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Electronics</h2>
          <p className="text-gray-600 text-sm">Laptops, phones, headphones, and more electronics.</p>
        </Link>
      </div>
      <div
        ref={listingsRef}
        id="listings"
        className="w-full max-w-6xl mt-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">All Listings</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  className="bg-white rounded-lg shadow-md p-4 text-left"
                  key={item.item_id}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-300">
                      {item.item_name}
                    </h3>
                    <p className="text-gray-700 text-lg">${item.item_price}</p>
                  </div>
                  {item.item_picture && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture}`}
                      alt={item.item_name}
                      className="mt-1 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-gray-500 mt-1">{item.item_description}</p>
                  <div className="flex justify-around items-center" >
                    <h4 className="text-sm text-gray-500">
                      Sold by <span className="text-blue-300">{item.user_name}</span>
                    </h4>
                    <button className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white ">
                     Add to Cart
                    </button>
              <button
                className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white "
                onClick={() => {
                  if (window.confirm('Please confirm purpose')) {
                    const params = new URLSearchParams({
                      item_id: item.item_id,
                      item_name: item.item_name,
                      item_price: item.item_price,
                      item_picture: item.item_picture || '',
                      item_category: item.item_category,
                      item_description: item.item_description,
                      seller_name: item.user_name,
                      seller_id:item.user_id,
                      seller_email: item.user_email || '',
                    });
                    router.push(`/buy?${params.toString()}`);
                  }
                }}
              >
                Buy Now
              </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}