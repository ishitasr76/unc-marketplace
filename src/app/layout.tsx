import React from "react";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "./QueryProvider";

export const metadata = {
  title: "UNC Marketplace",
  description: "Buy and sell items with fellow UNC students.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <Link href="/login" className="hover:underline">Login</Link>
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
