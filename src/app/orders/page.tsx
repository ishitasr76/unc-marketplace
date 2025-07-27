"use client";
import React, { use, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";

interface Item {
  item_name: string;
  item_price: string;
  item_picture: string;
  item_description: string;
  sold_by_user_name: string;
  sold_by_user_email: string;
  sold_by_user_id: string;
}

export default function OrdersPage() {
  const { current_user_id, current_user_name, current_user_email } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("ItemsSold")
        .select("item_name, item_category, item_price, item_picture, item_description, sold_by_user_name, sold_by_user_email, sold_by_user_id")
        .eq("bought_by_user_id", current_user_id);

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, [current_user_id]);

  if (!current_user_id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-unc-blue rounded-xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-white text-2xl">receipt_long</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            View your purchase history and seller information
          </p>
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <div
                  className="card bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                  key={index}
                >
                  {item.item_picture && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture}`}
                        alt={item.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {item.item_name}
                      </h3>
                      <p className="text-2xl font-bold text-primary">
                        ${item.item_price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.item_description}
                      </p>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-border">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Seller:</span> {item.sold_by_user_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Email:</span> {item.sold_by_user_email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-muted-foreground text-2xl">receipt_long</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">No orders yet</h3>
                <p className="text-muted-foreground">Start shopping to see your order history here</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 