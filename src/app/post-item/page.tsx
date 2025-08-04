"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function PostItemPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    picture: null as File | null,
    description: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowWarning(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  if (showWarning) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-destructive text-2xl">warning</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Authentication required</h3>
          <p className="text-destructive">You must be signed in to post an item. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFileButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Upload the picture to Supabase Storage
      let pictureUrl = null;
      if (form.picture) {
        const { data, error } = await supabase.storage
          .from("all-items-images")
          .upload(`pictures/${Date.now()}_${form.picture.name}`, form.picture);
  
        if (error) {
          throw error;
        }
        console.log(data)
        pictureUrl = data?.fullPath;
      }
  
      // Insert the item into the Items table
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        throw authError;
      }
      const userUID = user?.id|| "anonymous";
      console.log("User UID:", user);
      const { error } = await supabase.from("Items").insert([
        {
          user_id: userUID,
          user_name: user?.user_metadata.full_name || "n/a",
          user_email: user?.user_metadata.email || "n/a",
          item_name: form.name,
          item_category: (document.getElementById("categories") as HTMLSelectElement).value,
          item_price: parseFloat(form.price),
          item_picture: pictureUrl,
          item_description: form.description,
          uploaded_date_time: new Date().toISOString().split("T").join(" ").slice(0, -5),
          school_name: (document.getElementById("school_name") as HTMLSelectElement).value || "n/a"
        },
      ]);
  
      if (error) {
        throw error;
      }
  
      alert("Item posted successfully!");
      setForm({
        name: "",
        price: "",
        picture: null,
        description: "",
      });
    } catch (error) {
      console.error("Error posting item:", error);
      alert("Failed to post item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-unc-blue rounded-xl flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-white text-2xl">add_shopping_cart</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Post an Item</h1>
            <p className="text-muted-foreground">Sell your items to fellow college students</p>
          </div>
        </div>

        {/* Post Item Form */}
        <div className="card bg-background rounded-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Item name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="e.g. Mini Fridge"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="categories" className="text-sm font-medium text-foreground">
                  Category
                </label>
                <select 
                  id="categories"
                  name="categories" 
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="dorm-stuff">Dorm Stuff</option>
                  <option value="supplies">Supplies</option>
                  <option value="class-materials">Class Materials</option>
                  <option value="clothes">Clothes</option>
                  <option value="electronics">Electronics</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="school_name" className="text-sm font-medium text-foreground">
                  School Sold From
                </label>
                <select 
                  id="school_name"
                  name="school_name" 
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select a school</option>
                  <option value="UNC Chapel Hill">UNC Chapel Hill</option>
                  <option value="NC State">NC State</option>
                  <option value="Duke">Duke</option>
                 
                </select>
              </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-foreground">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="e.g. 50.00"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Item picture
              </label>
              <input
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                className="btn w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg border border-border hover:bg-secondary/80 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">upload</span>
                {form.picture ? "Change File" : "Choose File"}
              </button>
              {form.picture && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {(form.picture as File).name}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                placeholder="Describe your item..."
              />
            </div>

            <button
              type="submit"
              className="btn w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting item...</span>
                </div>
              ) : (
                "Post Item"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 