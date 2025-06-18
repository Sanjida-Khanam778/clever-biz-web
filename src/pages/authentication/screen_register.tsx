import { SubmitHandler, useForm } from "react-hook-form";
import { DateInput, LabelInput, PickCompanyLogo } from "../../components/input";
import { useNavigate } from "react-router";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { ImSpinner6 } from "react-icons/im";

const ScreenRegister = () => {
  const [loading, setLoading] = useState(false);

  type Inputs = {
    customer_name: string;
    restaurant_name: string;
    location: string;
    starting_date: string;
    phone_number: string;
    package: string;
    company_logo: FileList | undefined;
    email: string;
    password: string;
  };
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };
      console.log(payload);
      const res = await axiosInstance.post("/register/", payload);
      setLoading(false);
      console.log(res.data);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
      // Optional: toast or error message
    }
  };
  const logoFile: File | undefined = watch("company_logo")?.[0];
  return (
    <div className="bg-primary text-black p-8 rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-3xl mb-6 text-center text-primary-text">
        Enter your information
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <LabelInput
          label="Customer Name"
          inputProps={{
            id: "customer_name",
            placeholder: "Kawsar Hossain",
            ...register("customer_name"),
          }}
        />
        <LabelInput
          label="Restaurant Name"
          inputProps={{
            id: "restaurant_name",
            ...register("restaurant_name"),
          }}
        />
        <LabelInput
          label="Location"
          inputProps={{
            id: "location",
            ...register("location"),
          }}
        />
        <DateInput
          label="Starting Date"
          inputProps={{
            id: "starting_date",
            ...register("starting_date"),
          }}
        />
        <LabelInput
          label="Phone Number"
          inputProps={{
            id: "phone_number",
            ...register("phone_number"),
          }}
        />
        <LabelInput
          label="Package"
          inputProps={{
            id: "package",
            ...register("package"),
          }}
        />
        <PickCompanyLogo
          file={logoFile}
          label="Company Logo"
          inputProps={{
            id: "company_logo",
            ...register("company_logo"),
          }}
          removeFile={() => setValue("company_logo", undefined)}
        />
        <LabelInput
          label="Email"
          inputProps={{
            id: "email",
            ...register("email"),
          }}
        />
        <LabelInput
          label="Password"
          inputProps={{
            id: "password",
            ...register("password"),
          }}
        />
        <div className="text-center mt-14 mb-6">
          <button type="submit" className="button-primary px-14">
            {loading ? (
              <span className="flex gap-3 items-center justify-center">
                <ImSpinner6 className="animate-spin" /> Loading...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScreenRegister;
