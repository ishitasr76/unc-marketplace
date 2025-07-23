//needs to be marked like this because the child of this page uses a use state hook in the code.
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          {name ? `${name}, Welcome to UNC Marketplace!` : "Welcome to UNC Marketplace!"}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          The easiest way for UNC students to buy and sell dorm essentials, supplies, textbooks, clothes, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/category/dorm-stuff" className="bg-blue-300 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-500 transition">Browse Listings</Link>
          <Link href="/post-item" className="bg-white border border-blue-300 text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition">Post an Item</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8">
        <Link href="/category/dorm-stuff" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Dorm Stuff</h2>
          <p className="text-gray-600 text-sm">Beds, mini-fridges, decor, and more for your dorm room.</p>
        </Link>
        <Link href="/category/supplies" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Supplies</h2>
          <p className="text-gray-600 text-sm">School and study supplies, electronics, and more.</p>
        </Link>
        <Link href="/category/class-notes" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Class Notes</h2>
          <p className="text-gray-600 text-sm">Buy or sell class notes and textooks for your UNC classes.</p>
        </Link>
        <Link href="/category/clothes" className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Clothes</h2>
          <p className="text-gray-600 text-sm">UNC gear, seasonal wear, and more clothing items.</p>
        </Link>
      </div>
    </section>
  );
}
