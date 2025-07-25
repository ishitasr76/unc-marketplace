"use client";
import React, { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";
interface Item {
  item_id: number; 
  item_name: string;
  item_category: string;
  item_price: string;
  item_picture?: string;
  item_description: string;
  uploaded_date_time: string; //check if it should be string or date for (type)
  user_id: string;
  user_name: string;
}
interface UserStats {
  user_name: string;
  user_email: string;
  items_sold: number;
  items_bought: number;
  total_money_spent_on_app: number;
  total_money_made_on_app: number;
  member_since: string;
}
interface SoldItem {
  id: number;
  item_name: string;
  item_category: string;
  item_price: string;
  item_description: string;
  item_picture: string;

}


export default function UserInfoPage() {
  const { current_user_id, current_user_name, current_user_email } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();
  interface Item {
    item_name: string;
    item_price: string;
    item_picture: string;
    item_description: string;
    sold_by_user_name: string;
    sold_by_user_email: string;
    sold_by_user_id: string;
  }
  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("ItemsSold")
        .select("item_name, item_category, item_price, item_picture, item_description, sold_by_user_name, sold_by_user_email, sold_by_user_id")
        .eq("bought_by_user_id", current_user_id)
        // .order("sold_by_user_id", { ascending: true });

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    };

    fetchItems();
  }, [current_user_id]);
  console.log ("User Items:", items);

  if (!current_user_id) {
    return <div>Loading...</div>;
  }

  return (
    
    <section >
 <p className="text-lg text-gray-700 text-center"> Here is the information for the seller and your purchases:</p>

    <div className="flex flex-wrap items-center justify-center">
    {items.map((item) => (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center flex items-center justify-center border-2 border-blue-300">
        <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture || ''}`} alt={item.item_name || ''} className="w-1/2 h-1/2" />
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-5 ">
            <p className="text-lg text-gray-700 underline ">{item.item_name}</p>
            <p className="text-lg text-gray-700 "> ${item.item_price}</p>
          </div>
          <p className="text-md text-gray-700 ">{item.item_description}</p>
          <p className="text-md text-gray-700"> <span className="font-bold text-blue-300">Seller Email:</span> {item.sold_by_user_email}</p>
          <p className="text-md text-gray-700"> <span className="font-bold text-blue-300">Seller Name:</span> {item.sold_by_user_name}</p>
        </div>
      </div>
    </div>
     ))}
    </div>
    </section>
  );
} 