"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }, // to access: user.user_metadata.full_name
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setSuccess("Signup successful! Please check your email to confirm your account.");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Redirect after 2 seconds
    },
    onError: (error: any) => {
      setSuccess("");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupMutation.mutate(form);
  };

  return (
    <section className="flex flex-col items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: "#7BAFD4" }}>Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
          </label>
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
              autoComplete="new-password"
            />
          </label>
          <button
            type="submit"
            className="bg-[#7BAFD4] text-white rounded px-4 py-2 font-semibold hover:bg-blue-400 transition"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
          {signupMutation.isError && (
            <div className="text-red-600 text-sm text-center mt-2">
              {(signupMutation.error as any)?.message || "Signup failed. Please try again."}
            </div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center mt-2">{success}</div>
          )}
        </form>
      </div>
    </section>
  );
}
