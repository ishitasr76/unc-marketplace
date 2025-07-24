"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { unique } from "next/dist/build/utils";

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
  const router = useRouter();
// if the user is not signed in, it redirects them to log in before being able to post an item.
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
    return <div className="text-center mt-10">Checking authentication...</div>;
  }
  if (showWarning) {
    return <div className="text-center mt-10 text-red-600 font-semibold">You must be signed in to post an item. Redirecting to login...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
    try {
      // Upload the picture to Supabase Storage
      let pictureUrl = null;
      if (form.picture) {
        const { data, error } = await supabase.storage
          .from("item-images") // Replace with your storage bucket name
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
          item_name: form.name,
          item_category: (document.getElementById("categories") as HTMLSelectElement).value, // Get selected category
          item_price: parseFloat(form.price),
          item_picture: pictureUrl, // Save the picture URL
          item_description: form.description,
          uploaded_date_time: new Date().toISOString().split("T").join(" ").slice(0, -5)
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
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center">Post an Item</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium">Name of Item</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
              placeholder="e.g. Mini Fridge"
            />
            <span className="font-medium">Category</span>
            <select name="categories" id="categories" className="border rounded px-3 py-2"  required>
              {/* <option value="" disabled selected>Select a category</option> */}
              <option value="dorm-stuff">Dorm Stuff</option>
              <option value="supplies">Supplies</option>
              <option value="class-notes">Class Notes</option>
              <option value="clothes">Clothes</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Price ($)</span>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="border rounded px-3 py-2"
              placeholder="e.g. 50"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Picture</span>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={handleFileButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {form.picture ? "Change File" : "Choose File"}
            </button>
            {form.picture && (
              <span className="text-sm text-gray-600 mt-1">{(form.picture as File).name}</span>
            )}
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
              placeholder="Describe your item..."
              rows={4}
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
} 