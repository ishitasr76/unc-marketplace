"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import { supabase } from "@/utils/supabase/client";

export default function RootLayout({ children }: { children: React.ReactNode, searchParams: { name: string } }) {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Authentication error:", authError.message);
          return null;
        }
        const fullName = user?.user_metadata.full_name || null;
        setName(fullName); // Update state immediately
      } catch (error) {
        console.error("Error fetching user:", error);
        setName(null); // Ensure state is updated even on error
      }
    }

    // Fetch user only if authentication is available
    if (supabase.auth) {
      fetchUser();
    }
  }, []);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      window.location.href = "/login"; // Redirect to login page after sign-out
    }
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-blue-50">
        <QueryProvider>
          <header className="bg-blue-300 text-white shadow">
            <nav className="container mx-auto flex items-center justify-between py-4 px-6">
              <Link href="/" className="text-2xl font-bold tracking-tight">UNC Marketplace</Link>
              <div className="flex gap-4">
                <Link href="/category/dorm-stuff" className="hover:underline">Dorm Stuff</Link>
                <Link href="/category/supplies" className="hover:underline">Supplies</Link>
                <Link href="/category/class-notes" className="hover:underline">Class Notes</Link>
                <Link href="/category/clothes" className="hover:underline">Clothes</Link>
                {name ? (
                  <div className="flex items-center gap-2">
                    <Link href = "/user-info" className="hover:underline font-bold">{name}</Link>
                    <button
                      onClick={handleSignOut}
                      className="hover:underline text-sm bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="hover:underline">Login</Link>
                )}
              </div>
            </nav>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-blue-800 text-white text-center py-4 mt-8">
            &copy; {new Date().getFullYear()} UNC Marketplace. All rights reserved.
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}