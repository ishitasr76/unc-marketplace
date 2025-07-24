"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Supabase uses email for signIn, so you may want to use email instead of username
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email, // or use email field
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Get user's name from user_metadata.full_name
      const user = data.user;
      const name = user?.user_metadata?.full_name || user?.email || "User";
      // Redirect to home and reload the page
      window.location.href = "/";
    },
    onError: (error: any) => {
      setLoginError(error.message || "Login failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <section className="flex flex-col items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#7BAFD4" }}>Login</h1>
       
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            className="bg-[#7BAFD4] text-white rounded px-4 py-2 font-semibold hover:bg-blue-400 transition"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-gray-500 mb-6">
            Don't have an account? <Link href="/login/signup" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
          {loginMutation.isError && (
            <div className="text-red-600 text-sm text-center mt-2">
              {(loginMutation.error as any)?.message || "Login failed. Please try again."}
            </div>
          )}
        </form>
      </div>
    </section>
  );
} 