"use client";

import {
  ShoppingCart,
  Search,
  Tag,
  Zap,
  Grid,
  Plus,
  QrCode,
  ArrowRight,
} from "lucide-react";

export default function Checkout() {
  return (
    <>
      <div className="flex items-center gap-4 rounded-lg border bg-white p-2">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Name or code"
            className="flex-1 border-0 bg-transparent focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 border border-gray-300 hover:bg-gray-100">
          <Tag className="h-4 w-4" />
          Categories
        </button>
        <div className="flex items-center gap-2">
          <button className="rounded-md p-2 hover:bg-gray-100">
            <QrCode className="h-4 w-4" />
          </button>
          <button className="rounded-md p-2 hover:bg-gray-100">
            <Zap className="h-4 w-4" />
          </button>
          <button className="rounded-md p-2 hover:bg-gray-100">
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Button */}
      <div className="mt-4">
        <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white bg-emerald-500 hover:bg-emerald-600">
          <Plus className="h-4 w-4" />
          Products
        </button>
      </div>

      {/* Empty State */}
      <div className="mt-20 text-center">
        <div className="mx-auto mb-4 h-32 w-32">
          <div className="rounded-full bg-gray-100 p-8">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          </div>
        </div>
        <h2 className="mb-2 text-lg font-semibold">Your cart is empty.</h2>
        <p className="text-sm text-gray-600">
          Click on the products to add them to the sale.
        </p>
      </div>

      {/* Bottom Payment Bar */}
      <div className="fixed bottom-0 left-64 right-0 border-t bg-gray-50 p-4 flex justify-end">
        <button className="flex items-center justify-between w-64 gap-2 rounded-md px-3 py-2 text-sm text-white bg-gray-300 cursor-not-allowed">
          <ShoppingCart className="h-4 w-4" />
          <span className="font-semibold">Go to payment</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
