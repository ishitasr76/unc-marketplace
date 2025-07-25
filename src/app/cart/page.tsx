"use client";
import React, { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/UserContext";
interface Item {
  id: string; 
  item_name: string;
  item_category: string;
  item_price: string;
  item_picture?: string;
  item_description: string;
  seller_name: string;
seller_id:string;
seller_email:string;
all_items_db_id:string;}
export default function CartPage() {
  const { current_user_id, current_user_name, current_user_email } = useUser(); 
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!current_user_id) return; // Wait for user to be loaded
    
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("InCartItems")
        .select("id, item_name, item_category, item_price, item_picture, item_description, seller_name, seller_id, seller_email, all_items_db_id")
        .eq("buyer_id", current_user_id); // Filter by user cart

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
    };

    fetchItems();
  }, [current_user_id]); // Add current_user_id to dependency array

  if (!current_user_id) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
       <div className="flex flex-row justify-between align-center w-full">
       <p className="text-lg text-gray-700">
          Items in your cart: {items.length}
        </p>
        <button
                className="mt-2 border-2 border-blue-300 text-blue-300 px-4 py-2 rounded hover:bg-blue-300 hover:text-white "
                onClick={() => {
                  if (current_user_id === null) {
                    alert('Please login to purchase this item');
                    router.push('/login');
                    return;
                  }
                  else if (window.confirm('Please confirm purchase for these items')) {
                   items.map(async (item) => {
                    const { error: insertError } = await supabase
                    .from("ItemsSold")
                    .insert({
                      item_name: item.item_name,
                      item_price: item.item_price,
                      item_picture: item.item_picture,
                      item_category: item.item_category,
                      item_description: item.item_description,
                      sold_by_user_id: item.seller_id,
                      bought_by_user_id: current_user_id,
                      sold_by_user_name: item.seller_name,
                      bought_by_user_name: current_user_name,
                      sold_by_user_email: item.seller_email,

                    })
                    if (insertError) {
                      console.error("Error inserting item:", insertError);
                    }
                    async function updateSellerStats() {
                      const { data } = await supabase
                        .from('UserStats')
                        .select('items_sold, total_money_made_on_app')
                        .eq('user_id', item.seller_id);
                      console.log(data);
                      const items_sold = (data?.[0]?.items_sold || 0) + 1;
                      const total_money_made_on_app = (data?.[0]?.total_money_made_on_app || 0) + Number(item.item_price);
                
                      const { error } = await supabase
                        .from('UserStats')
                        .update({
                          items_sold: items_sold,
                          total_money_made_on_app: total_money_made_on_app
                        })
                        .eq('user_id', item.seller_id);
                      if (error) {
                        alert('Failed to update seller stats!');
                        console.error(error);
                      } else {
                        console.log('Seller stats updated!');
                      }
                    }
                    async function updateBuyerStats() {
                      const { data } = await supabase
                        .from('UserStats')
                        .select('items_bought, total_money_spent_on_app')
                        .eq('user_id', current_user_id);
                      console.log(data);
                      const items_bought = (data?.[0]?.items_bought || 0) + 1;
                      const total_money_spent_on_app = (data?.[0]?.total_money_spent_on_app || 0) + Number(item.item_price);
                
                      const { error } = await supabase
                        .from('UserStats')
                        .update({
                          items_bought: items_bought,
                          total_money_spent_on_app: total_money_spent_on_app
                        })
                        .eq('user_id', current_user_id);
                      if (error) {
                        alert('Failed to update buyer stats!');
                        console.error(error);
                      } else {
                        console.log('Buyer stats updated!');
                      }
                    }
                    updateSellerStats();
                    updateBuyerStats();
                    const { error: deleteItemError } = await supabase
                    .from("Items")
                    .delete()
                    .eq("item_id", item.all_items_db_id);
                    if (deleteItemError) {
                      console.error("Error deleting item:", deleteItemError);
                    }
                    const { error: deleteCartError } = await supabase
                    .from("InCartItems")
                    .delete()
                    .eq("id", item.id);
                    if (deleteCartError) {
                      console.error("Error deleting item:", deleteCartError);
                    }
                   })
                   alert("Items purchased successfully. Please check user tab for order details/stats");
                   router.push("/");
                }}}
              >
                Buy Now
          </button>
       </div>
      <div className="flex flex-col justify-start w-full">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="bg-white rounded-lg shadow-md p-4 text-left w-full m-2 flex justify-between align-center "
              key={item.id}
            >
                 {item.item_picture && (
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture}`}
                  alt={item.item_name}
                  className="mt-1 w-1/5 h-40 object-cover rounded-lg"
                />
              )}
              <div className="flex flex-col justify-center align-center w-1/4">
              <h2 className="text-xl font-semibold text-blue-300">
                {item.item_name}
              </h2>
              <p className="text-gray-500 mt-1">{item.item_description}</p>
              <h1 className="text-sm text-gray-500"> 
                Sold by <span className="text-blue-300">
                  {item.seller_name}
                </span>
              </h1>
              </div>
                             
               <p className="flex flex-col text-gray-700 text-lg justify-center align-center">${item.item_price}</p>
               <button className = "flex flex-col justify-center align-center"
               onClick={async () => {
                const { error } = await supabase
                .from("InCartItems")
                .delete()
                .eq("id", item.id);
                if (error) {
                  console.error("Error deleting item:", error);
                } else {
                  alert("Item deleted successfully");
                  window.location.reload();
                }
               }}>
               <span className=" material-symbols-outlined hover:text-red-300">
                        delete
                      </span>
               </button>


            </div>
          ))
        ) : (
          <p className="text-gray-500">No items found in your cart.</p>
        )}
      </div>
    </section>
  );
}