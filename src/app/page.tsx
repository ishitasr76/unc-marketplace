import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Welcome to UNC Marketplace!</h1>
        <p className="text-lg text-gray-700 mb-6">
          The easiest way for UNC students to buy and sell dorm essentials, supplies, textbooks, clothes, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/category/dorm-stuff" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">Browse Listings</Link>
          <Link href="#" className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition">Post an Item</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mt-8">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Dorm Stuff</h2>
          <p className="text-gray-600 text-sm">Beds, mini-fridges, decor, and more for your dorm room.</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Supplies</h2>
          <p className="text-gray-600 text-sm">School and study supplies, electronics, and more.</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Textbooks</h2>
          <p className="text-gray-600 text-sm">Buy or sell textbooks for your UNC classes.</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <h2 className="font-semibold text-blue-700 mb-2">Clothes</h2>
          <p className="text-gray-600 text-sm">UNC gear, seasonal wear, and more clothing items.</p>
        </div>
      </div>
    </section>
  );
}
