import React from "react";

export default function ClothesPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Clothes</h1>
        <p className="text-lg text-gray-700 mb-6">
          UNC gear, seasonal wear, and more clothing items.
        </p>
      </div>
    </section>
  );
} 