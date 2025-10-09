import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PlaceOrder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate("/")} className="flex items-center space-x-1 text-gray-600">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Place Order</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Upload your file to print
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          This is the Place Order page. You can add your upload form, paper size
          selection, color options, and payment details here.
        </p>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => alert("Order placed successfully!")}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;
