import axiosInstance from "@/lib/axios";
import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";

// Define the type of each category (adjust fields based on actual API)
interface Category {
  id: number;
  Category_name: string;
}

// Define the context type
interface OwnerContextType {
  categories: Category[];
  fetchCategories: () => Promise<void>;
}

// Create the context
export const OwnerContext = createContext<OwnerContextType | undefined>(
  undefined
);

// Create the provider
export const OwnerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        "http://192.168.10.150:8000/owners/categories/"
      );
      setCategories(res.data.results);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories.");
    }
  };

  const value: OwnerContextType = { categories, fetchCategories };

  return (
    <OwnerContext.Provider value={value}>{children}</OwnerContext.Provider>
  );
};

// Custom hook to consume the context
export const useOwner = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
};
