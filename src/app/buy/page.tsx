"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import router from "next/router";
import { useUser } from "../UserContext";

export default function BuyPage() {
const { current_user_id, current_user_name, current_user_email } = useUser();

  const searchParams = useSearchParams();
  const item_id = searchParams.get("item_id");
  const itemName = searchParams.get("item_name");   
  const itemDescription = searchParams.get("item_description");
  const itemPicture = searchParams.get("item_picture");
  const itemPrice = searchParams.get("item_price");
  const itemCategory = searchParams.get("item_category");
  const sellerId = searchParams.get("seller_id");
  const sellerName = searchParams.get("seller_name");
  const sellerEmail = searchParams.get("seller_email");
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    async function recordSale() {
      const { error } = await supabase
        .from('ItemsSold')
        .insert([
          {
            item_name: itemName,
            item_category: itemCategory,
            item_price: itemPrice,
            item_description: itemDescription,
            item_picture: itemPicture,

            sold_by_user_id: sellerId,
            sold_by_user_name: sellerName,
            bought_by_user_id: current_user_id,
            bought_by_user_name: current_user_name,
          }
        ]);
      if (error) {
        alert('Failed to record sale!');
        console.error(error);
      } else {
        // Optionally alert or handle success
        alert('Sale recorded!');
      }
    }
    async function removeItemFromMarketplace() {
      const { error } = await supabase
        .from('Items')
        .delete()
        .eq('item_id', item_id);
    }
    async function updateSellerStats(){
        const {data} = await supabase
        .from ('UserStats')
        .select('items_sold, total_money_made_on_app')
        .eq('user_id', sellerId);
        console.log (data);
        const items_sold = data?.[0]?.items_sold +1
        const total_money_made_on_app = data?.[0]?.total_money_made_on_app + itemPrice
      
        const {error} = await supabase
        .from ('UserStats')
        .update({
            "items_sold":items_sold,
            "total_money_made_on_app" : total_money_made_on_app
        })
        .eq('user_id', sellerId);
        if (error) {
            alert('Failed to update seller stats!');
            console.error(error);
        } else {
            console.log('Seller stats updated!');
        }
    }
    async function updateBuyerStats(){
        const {data} = await supabase
        .from ('UserStats')
        .select('items_bought, total_money_spent_on_app')
        .eq('user_id', current_user_id);
        console.log (data);
        const items_bought = data?.[0]?.items_bought +1
        const total_money_spent_on_app = data?.[0]?.total_money_spent_on_app +itemPrice
        const {error} = await supabase
        .from ('UserStats')
        .update({
            "items_bought":items_bought,
            "total_money_spent_on_app" : total_money_spent_on_app
        })
        .eq('user_id', current_user_id);
        if (error) {
            alert('Failed to update buyer stats!');
            console.error(error);
        } else {
            console.log('Buyer stats updated!');
        }
    }
    if ( itemName && itemPrice && sellerEmail && sellerName) {
      recordSale();
      removeItemFromMarketplace();
      updateSellerStats();
      updateBuyerStats();
    }
  }, [itemName]);

  return (
      <section className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold text-blue-300 mb-4"> Congratulations! You have successfully bought an item from the marketplace.</h1>
        <p className="text-lg text-gray-700 mb-6"> We have sent an email to the seller with your purchase information. Make sure to contact them to arrange payment and pickup or delivery.</p>
        <p className="text-lg text-gray-700 mb-6">Here is the information for the seller and your purchase:</p>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center flex items-center justify-center border-2 border-blue-300">
         <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${itemPicture || ''}`} alt={itemName || ''} className="w-1/2 h-1/2" />
        <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-5 ">
         <p className="text-lg text-gray-700 underline ">{itemName}</p>
         <p className="text-lg text-gray-700 "> ${itemPrice}</p>
         </div>
         <p className="text-md text-gray-700 ">{itemDescription}</p>
         <p className="text-md text-gray-700"> <span className="font-bold text-blue-300">Seller Email:</span> {sellerEmail}</p>
         <p className="text-md text-gray-700"> <span className="font-bold text-blue-300">Seller Name:</span> {sellerName}</p>
        </div>
        </div>
     
      </div>
    </section>
  );
} 