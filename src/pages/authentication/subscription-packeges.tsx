/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import { Check, Clock, Shield, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const SubscriptionCards = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: "price_1SSbFQGDJUexMwDgKdPlke1Q",
      name: "Free for 14 Days",
      price: 0,
      currency: "AED",
      period: "14 days trial",
      icon: Clock,
      color: "from-gray-500 to-gray-600",
      popular: false,
      features: [
        "Full service access",
        "No commitment",
        "Perfect for exploration",
        "14 days unlimited access",
      ],
    },
    {
      id: "price_1SSb0YGDJUexMwDgfeDj3VGZ",
      name: "Monthly Package",
      price: 2599.0,
      currency: "AED",
      period: "per month",
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      popular: false,
      features: [
        "All premium services",
        "No long-term commitment",
        "Flexible billing",
        "Cancel anytime",
      ],
    },
    {
      id: "price_1SSb2HGDJUexMwDgT4e0Li47",
      name: "6-Month Package",
      price: 13260.0,
      currency: "AED",
      period: "every 6 months",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      popular: true,
      savings: "15% savings",
      monthlyEquivalent: 2210,
      features: [
        "15% discount applied",
        "Pay once for 6 months",
        "Long-term value",
        "Consistent access",
      ],
    },
    {
      id: "price_1SSb37GDJUexMwDgQFZ826wi",
      name: "Yearly Package",
      price: 23712.0,
      currency: "AED",
      period: "per year",
      icon: Star,
      color: "from-amber-500 to-amber-600",
      popular: false,
      savings: "24% savings",
      monthlyEquivalent: 1976,
      features: [
        "24% discount applied",
        "Best value package",
        "Uninterrupted service",
        "Maximum savings",
      ],
    },
  ];
  const createSubscription = async (planId: number | string) => {
    try {
      const response = await axiosInstance.post(
        "/subscription/create-checkout-session/",
        { price_id: planId }
      );

      const checkoutUrl = response?.data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl; // redirect to stripe
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      }

      console.error("Subscription create failed", error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[1880px] mx-auto bg-gradient-to-br p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect subscription package that fits your needs. All
            plans include full access to our premium services.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl  shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer ${
                  selectedPlan === plan.id ? "ring-4 ring-blue-400" : ""
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg shadow-md">
                    MOST POPULAR
                  </div>
                )}

                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${plan.color} p-6 text-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-8 h-8" />
                    {plan.savings && (
                      <span className="bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                        {plan.savings}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.currency}</span>
                    <span className="text-4xl font-bold">
                      {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mt-1">{plan.period}</p>

                  {plan.monthlyEquivalent && (
                    <p className="text-xs opacity-80 mt-2">
                      ≈ AED {plan.monthlyEquivalent}/month
                    </p>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? "bg-gradient-to-r " +
                          plan.color +
                          " text-white shadow-lg"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => createSubscription(plan?.id)}
                  >
                    {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                  </button>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1 bg-gradient-to-r ${plan.color}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCards;
