import React from "react";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function SubscriptionCancelled() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full relative">
        {/* Card */}
        <div className="bg-[#0F172A] rounded-3xl shadow-2xl p-12 text-center transform hover:scale-105 transition-transform duration-300 border border-blue-800">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative bg-red-100 rounded-full p-4">
                <XCircle className="w-16 h-16 text-red-600" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Subscription Cancelled
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            We're sorry to see you go. Your subscription has been cancelled
            successfully.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRedirect}
              className="w-full bg-gradient-to-r bg-primary border-2 border-white hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Return to Home
            </button>
            <button
              onClick={handleRedirect}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 px-8 rounded-xl transition-all duration-200"
            >
              Reactivate Subscription
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-400 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-2xl animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
