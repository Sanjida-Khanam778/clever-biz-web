import axiosInstance from "@/lib/axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import toast from "react-hot-toast";

// Define privacy policy type
interface PrivacyPolicy {
  id?: number;
  text: string;
  updated_at?: string;
}

// Define terms and conditions type
interface TermsAndConditions {
  id?: number;
  content: string;
  updated_at?: string;
}

// Define FAQ type
interface FAQ {
  id: number;
  question: string;
  answer: string;
}

// Define the context type
interface AdminContextType {
  privacyPolicy: PrivacyPolicy | null;
  termsAndConditions: TermsAndConditions | null;
  faqs: FAQ[];
  isLoading: boolean;
  fetchPrivacyPolicy: () => Promise<void>;
  updatePrivacyPolicy: (content: string) => Promise<void>;
  fetchTermsAndConditions: () => Promise<void>;
  updateTermsAndConditions: (content: string) => Promise<void>;
  fetchFAQs: () => Promise<void>;
  createFAQ: (question: string, answer: string) => Promise<void>;
  updateFAQ: (id: number, question: string, answer: string) => Promise<void>;
  deleteFAQ: (id: number) => Promise<void>;
}

// Create the context
export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);

// Create the provider
export const AdminProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy | null>(
    null
  );
  const [termsAndConditions, setTermsAndConditions] =
    useState<TermsAndConditions | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrivacyPolicy = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/adminapi/policy/");
      setPrivacyPolicy(response.data.results);
    } catch (error: any) {
      console.error("Failed to load privacy policy", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load privacy policy.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePrivacyPolicy = useCallback(async (id: number, content: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(`/adminapi/policy/${id}/`, {
        text: content,
      });
      setPrivacyPolicy(response.data);
      toast.success("Privacy policy updated successfully!");
    } catch (error: any) {
      console.error("Failed to update privacy policy", error);
      toast.error("Failed to update privacy policy.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTermsAndConditions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("adminapi/terms-and-conditions/");
      setTermsAndConditions(response.data.results);
    } catch (error: any) {
      console.error("Failed to load terms and conditions", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load terms and conditions.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTermsAndConditions = useCallback(async (id: number, content: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(`adminapi/terms-and-conditions/${id}/`, {
        text: content,
      });
      setTermsAndConditions(response.data);
      console.log(response.data);
      toast.success("Terms and conditions updated successfully!");
    } catch (error: any) {
      console.error("Failed to update terms and conditions", error);
      toast.error("Failed to update terms and conditions.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFAQs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/adminapi/faq/");
      setFaqs(response.data.results);
    } catch (error: any) {
      console.error("Failed to load FAQs", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load FAQs.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFAQ = useCallback(async (question: string, answer: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/adminapi/faq/", {
        question,
        answer,
      });
      setFaqs((prev) => [...prev, response.data]);
      toast.success("FAQ created successfully!");
    } catch (error: any) {
      console.error("Failed to create FAQ", error);
      toast.error("Failed to create FAQ.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFAQ = useCallback(
    async (id: number, question: string, answer: string) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.patch(`/adminapi/faq/${id}/`, {
          question,
          answer,
        });
        setFaqs((prev) =>
          prev.map((faq) => (faq.id === id ? response.data : faq))
        );
        toast.success("FAQ updated successfully!");
      } catch (error: any) {
        console.error("Failed to update FAQ", error);
        toast.error("Failed to update FAQ.");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteFAQ = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/adminapi/faq/${id}/`);
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      toast.success("FAQ deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete FAQ", error);
      toast.error("Failed to delete FAQ.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AdminContextType = {
    privacyPolicy,
    termsAndConditions,
    faqs,
    isLoading,
    fetchPrivacyPolicy,
    updatePrivacyPolicy,
    fetchTermsAndConditions,
    updateTermsAndConditions,
    fetchFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Custom hook to consume the context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
