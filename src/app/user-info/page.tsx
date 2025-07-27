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
  uploaded_date_time: string;
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [itemsResult, statsResult, soldResult] = await Promise.all([
        supabase
          .from("Items")
          .select("item_id, item_name, item_category, item_price, item_picture, item_description, uploaded_date_time, user_id, user_name")
          .eq("user_id", current_user_id),
        supabase
          .from("UserStats")
          .select("user_name, user_email, items_sold, items_bought, total_money_spent_on_app, total_money_made_on_app, member_since")
          .eq("user_id", current_user_id),
        supabase
          .from("ItemsSold")
          .select("id, item_name, item_category, item_price, item_description, item_picture")
          .eq("sold_by_user_id", current_user_id)
      ]);

      if (itemsResult.error) console.error("Error fetching items:", itemsResult.error);
      if (statsResult.error) console.error("Error fetching stats:", statsResult.error);
      if (soldResult.error) console.error("Error fetching sold items:", soldResult.error);

      setItems(itemsResult.data || []);
      setUserStats(statsResult.data || []);
      setSoldItems(soldResult.data || []);
      setLoading(false);
    };

    fetchData();
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
            <span className="material-symbols-outlined text-white text-2xl">person</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome back, {current_user_name}!
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* User Stats */}
          <div className="card bg-background rounded-xl border border-border p-6">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-primary">{userStats[0]?.items_sold || 0}</p>
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-primary">{userStats[0]?.items_bought || 0}</p>
                  <p className="text-sm text-muted-foreground">Items Bought</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-primary">${userStats[0]?.total_money_made_on_app || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-primary">${userStats[0]?.total_money_spent_on_app || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">Member since</p>
                  <p className="text-sm text-muted-foreground">{userStats[0]?.member_since || 'N/A'}</p>
                </div>
              </div>
              <button 
                className="btn bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90"
                onClick={() => router.push("/orders")}
              >
                View Orders
              </button>
            </div>
          </div>

          {/* Active Listings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Active Listings</h2>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <div
                    className="card bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                    key={item.item_id}
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
                      
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                        <button
                          className="btn flex-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90"
                          onClick={async () => {
                            const { error } = await supabase
                              .from('Items')
                              .delete()
                              .eq('item_id', item.item_id);
                            if (error) {
                              console.error("Error deleting item:", error);
                            } else {
                              alert("Item removed successfully");
                              window.location.reload();
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-muted-foreground text-2xl">inventory_2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No active listings</h3>
                  <p className="text-muted-foreground">Start selling to see your items here</p>
                </div>
              </div>
            )}
          </div>

          {/* Sold Items */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Sold Items</h2>
            {soldItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {soldItems.map((item) => (
                  <div
                    className="card bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
                    key={item.id}
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
                      
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Sold
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-muted-foreground text-2xl">sell</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No sold items yet</h3>
                  <p className="text-muted-foreground">Your sold items will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 