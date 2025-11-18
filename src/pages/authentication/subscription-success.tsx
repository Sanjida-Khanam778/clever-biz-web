import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full relative">
        {/* Card */}
        <div className="bg-[#0F172A] rounded-3xl shadow-2xl p-12 text-center transform hover:scale-105 transition-transform duration-300 border border-blue-800">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative bg-blue-100 rounded-full p-4">
                <CheckCircle
                  className="w-16 h-16 text-blue-700"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-4xl font-bold text-white mb-4">
            You're All Set!
          </h1>
          <p className="text-lg text-gray-300 mb-10">
            Your subscription is now active. Welcome to the premium experience!
          </p>

          {/* Button */}
          <button
            onClick={handleRedirect}
            className="w-full bg-gradient-to-r bg-primary border-white border-2 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Continue to Dashboard
          </button>

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
