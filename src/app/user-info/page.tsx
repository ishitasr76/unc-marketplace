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
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const router = useRouter();
  useEffect(() => {
    console.log (current_user_id);
    console.log (current_user_name);
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("Items")
        .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name")
        .eq("user_id", current_user_id); // Filter by category

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    };
    const fetchUserStats = async () => {
      const { data, error } = await supabase
        .from("UserStats")
        .select("user_name, user_email, items_sold, items_bought, total_money_spent_on_app, total_money_made_on_app, member_since")
        .eq("user_id", current_user_id); // Filter by category

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setUserStats(data || []);
      }
    };
    const fetchSoldItems = async () => {
      const { data, error } = await supabase
        .from("ItemsSold")
        .select("id,item_name, item_category, item_price, item_description, item_picture")
        .eq("sold_by_user_id", current_user_id);
      if (error) {
        console.error("Error fetching sold items:", error);
      } else {
        setSoldItems(data || []);
      }
    };
    fetchSoldItems();
    fetchUserStats();
    fetchItems();
  }, [current_user_id]);
  console.log ("User Items:", items);
  console.log ("User Stats:", userStats);
  console.log ("User Sold Items:", soldItems);
  if (!current_user_id) {
    return <div>Loading...</div>;
  }
  return (
    <section className="flex row items-center justify-center gap-5" >
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full ">
      {/* <h1 className = "text-2xl font-semibold"> Your products on the market:</h1> */}
      <div className="bg-white rounded-lg shadow-md p-4 text-left flex flex-col items-center justify-center ">
      <h1 className = "text-4xl font-bold text-blue-300 underline"> Hello, {current_user_name} </h1> 
      <h1 className = "text-2xl font-semibold text-gray-600"> Your outstanding stats:</h1>
      <p className="text-gray-600 text-lg">Items sold: <span className="text-blue-300">{userStats[0]?.items_sold}</span></p>
      <p className="text-gray-600 text-lg">Items bought: <span className="text-blue-300">{userStats[0]?.items_bought}</span></p>
      <p className="text-gray-600 text-lg">Total money spent on app: <span className="text-blue-300">${userStats[0]?.total_money_spent_on_app}</span></p>
      <p className="text-gray-600 text-lg">Total money made on app: <span className="text-blue-300">${userStats[0]?.total_money_made_on_app}</span></p>
      <p className="text-gray-600 text-lg">Member since: <span className="text-blue-300">{userStats[0]?.member_since}</span></p>
      <button className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white "
      onClick={() => {
        router.push("/orders");
      }}>
        View Orders
      </button>
      </div>
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="bg-white rounded-lg shadow-md p-4 text-left"
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
                  className="mt-1 w-full h-50 object-cover rounded-lg"
                />
              )}
                <p className="text-gray-500 mt-1">{item.item_description}</p>
                <div className="flex justify-around items-center">
                <button className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white ">
                On the market
              </button>
              <button className="mt-2 border-2 border-red-300 text-red-300 px-4 py-2 rounded hover:bg-red-300 hover:text-white "
              onClick={async () => {
                const { error } = await supabase
                .from('Items')
                .delete()
                .eq('item_id', item.item_id);
                if (error) {
                  console.error("Error deleting item:", error);
                } else {
                  alert("Item deleted successfully");
                window.location.reload();                }
              }}>
                Remove Item
              </button>
                </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-blue-300 text-2xl">No items on the market!</p>
          </div>
        )}
        {soldItems.length > 0 ? (
          soldItems.map((item) => (
            <div
              className="bg-white rounded-lg shadow-md p-4 text-left"
              key={item.id}
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
                  className="mt-1 w-full h-50 object-cover rounded-lg"
                />
              )}
                <p className="text-gray-500 mt-1">{item.item_description}</p>
                <button className="mt-2 border-2 bg-red-400 text-white px-4 py-2 rounded ">
                Sold
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
          <p className="text-blue-300 text-2xl">No items sold!</p>
          </div>
        )}
      </div>
    </section>
  );
} 