"use client";
import React, { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/UserContext";
interface Item {
  item_id: string; 
  item_name: string;
  item_category: string;
  item_price: string;
  item_picture?: string;
  item_description: string;
  uploaded_date_time: string; //check if it should be string or date for (type)
  user_id: string;
  user_name: string;
  user_email: string;
}
export default function ClassNotesPage() {
  const router = useRouter();
  const { current_user_id, current_user_name, current_user_email } = useUser();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("Items")
        .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name, user_email")
        .eq("item_category", "class-notes"); // Filter by category

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    };

    fetchItems();
  }, []);
  console.log ("Dorm Stuff Items:", items);

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-300 mb-4">Class Notes</h1>
        <p className="text-lg text-gray-700 mb-6">
          Buy or sell class notes and textbooks for your UNC classes.
        </p>
      </div>
      <div className="flex flex-wrap justify-start w-full">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="bg-white rounded-lg shadow-md p-4 text-left w-15/48 m-2"
              key={item.item_id}
            >
              <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-300">
                {item.item_name}
              </h2>
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
              <h1 className="text-sm text-gray-500"> 
                Sold by <span className="text-blue-300">
                  {item.user_name}
                </span>
              </h1>
              <button className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white ">
                     Add to Cart
                </button>
                <button
                className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white "
                onClick={() => {
                  if (current_user_id === null) {
                    alert('Please login to purchase this item');
                    router.push('/login');
                    return;
                  }
                  else if (window.confirm('Please confirm purchase of this item')) {
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
          <p className="text-gray-500">No items found for class notes.</p>
        )}
      </div>
    </section>
  );
}