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
  uploaded_date_time: string;
  user_id: string;
  user_name: string;
  user_email: string;
  school_name:string;
}

export default function ClothesPage() {
  const { current_user_id, current_user_name, current_user_email } = useUser();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("Items")
        .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name, user_email, school_name")
        .eq("item_category", "clothes");

      if (error) {
        console.error("Error fetching items:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-pink-600 rounded-xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-white text-2xl">checkroom</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Clothes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            College gear, seasonal wear, and more clothing items.
          </p>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading items...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                className="card bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                key={item.item_id}
              >
                {item.item_picture && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.item_picture}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                      {item.item_name}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      ${item.item_price}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.item_description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.school_name}
                        </span>
                    <p className="text-sm text-muted-foreground">
                      Sold by{" "}
                      <span className="font-medium text-foreground">{item.user_name}</span>
                    </p>
                    
                    <div className="flex gap-2">
                      <button 
                        className="btn flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
                        onClick={async () => {
                          const { error } = await supabase
                            .from('InCartItems')
                            .insert([
                              {
                                item_name: item.item_name,
                                item_category: item.item_category,
                                item_price: item.item_price,
                                item_description: item.item_description,
                                item_picture: item.item_picture,
                                seller_id: item.user_id,
                                seller_name: item.user_name,
                                seller_email: item.user_email,
                                buyer_id: current_user_id,
                                all_items_db_id: item.item_id,
                                school_name: item.school_name
                              }
                            ])
                          if (error) {
                            console.error("Error adding item to cart", error);
                          } else {
                            alert("Item added to cart successfully");
                            window.location.reload();
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                      
                      <button
                        className="btn flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary/80"
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
                              seller_id: item.user_id,
                              seller_email: item.user_email || '',
                              school_name: item.school_name
                            });
                            router.push(`/buy?${params.toString()}`);
                          }
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-muted-foreground text-2xl">checkroom</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">No clothing items found</h3>
                <p className="text-muted-foreground">Be the first to post clothing items!</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}