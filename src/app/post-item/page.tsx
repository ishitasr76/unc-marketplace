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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Form submitted! (No backend logic yet)");
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
              required
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