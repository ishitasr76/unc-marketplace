"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "./QueryProvider";
import { supabase } from "@/utils/supabase/client";
import { UserProvider } from "./UserContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <UserProvider>
    <html lang="en">
    <title>UNC Marketplace</title>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-background">
        <QueryProvider>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex items-center justify-between py-4 px-6">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-unc-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UNC</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">Marketplace</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/category/dorm-stuff" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dorm Stuff</Link>
                <Link href="/category/supplies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Supplies</Link>
                <Link href="/category/class-materials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Class Materials</Link>
                <Link href="/category/clothes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Clothes</Link>
                <Link href="/category/electronics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Electronics</Link>
              </div>
              
              <div className="flex items-center space-x-4">
                {name ? (
                  <>
                    <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <span className="material-symbols-outlined text-xl">shopping_cart</span>
                    </Link>
                    <Link href="/user-info" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {name}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md hover:bg-destructive/90 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Login</Link>
                )}
              </div>
            </nav>
          </header>
          
          <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">{children}</main>
          
          <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-unc-blue rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">UNC</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} UNC Marketplace. All rights reserved.
                  </span>
                </div>
                <div className="flex space-x-6 text-sm text-muted-foreground">
                  <Link href="/category/dorm-stuff" className="hover:text-foreground transition-colors">Dorm Stuff</Link>
                  <Link href="/category/supplies" className="hover:text-foreground transition-colors">Supplies</Link>
                  <Link href="/category/class-materials" className="hover:text-foreground transition-colors">Class Materials</Link>
                  <Link href="/category/clothes" className="hover:text-foreground transition-colors">Clothes</Link>
                  <Link href="/category/electronics" className="hover:text-foreground transition-colors">Electronics</Link>
                </div>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
    </UserProvider>
  );
}