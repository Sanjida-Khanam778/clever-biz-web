import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
  initialSecret?: string;
  initialPublishable?: string;
  postUrl?: string; // default: /owners/stripe
};

type FormShape = {
  stripe_secret_key: string;
  stripe_publishable_key: string;
};

export default function StripeConnectModal({
  open,
  onClose,
  onSuccess,
  initialSecret = "",
  initialPublishable = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<FormShape>({
    defaultValues: {
      stripe_secret_key: initialSecret,
      stripe_publishable_key: initialPublishable,
    },
  });

  // Close on Esc + reset on open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && !loading && onClose();
    window.addEventListener("keydown", onKey);
    setServerMsg(null);
    reset({
      stripe_secret_key: initialSecret,
      stripe_publishable_key: initialPublishable,
    });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose, reset, initialSecret, initialPublishable]);

  if (!open) return null;

  const onSubmit = async (form: FormShape) => {
    setLoading(true);
    setServerMsg(null);
    try {
      const payload: FormShape = {
        stripe_secret_key: form.stripe_secret_key.trim(),
        stripe_publishable_key: form.stripe_publishable_key.trim(),
      };
      const { data } = await axiosInstance.post("/owners/stripe/", payload);
      console.log(data, "Stripe keys saved successfully");
      onSuccess?.(data);
      onClose();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 ${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !loading && onClose()}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-sidebar/90 backdrop-blur-xl p-6 shadow-2xl border border-white/10">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white">
              Add Stripe Keys
            </h3>
            <button
              onClick={() => !loading && onClose()}
              className="ml-3 rounded-md p-1 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-60"
              aria-label="Close"
              disabled={loading}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="mt-2 text-sm text-gray-300">
            Paste your Stripe API keys below. You can rotate them anytime.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label
                className="block text-sm text-gray-300 mb-1"
                htmlFor="stripe-secret"
              >
                Stripe Secret Key
              </label>
              <input
                id="stripe-secret"
                type="text"
                className="w-full rounded-lg bg-[#201C3F] text-white placeholder:text-white/40 shadow-md text-sm px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-purple-400"
                placeholder="sk_test_..."
                {...register("stripe_secret_key")}
                disabled={loading}
              />
            </div>

            <div>
              <label
                className="block text-sm text-gray-300 mb-1"
                htmlFor="stripe-publishable"
              >
                Stripe Publishable Key
              </label>
              <input
                id="stripe-publishable"
                type="text"
                className="w-full rounded-lg bg-[#201C3F] text-white placeholder:text-white/40 shadow-md text-sm px-3 py-2.5 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-purple-400"
                placeholder="pk_test_..."
                {...register("stripe_publishable_key")}
                disabled={loading}
              />
            </div>

            {serverMsg && <p className="text-sm text-red-400">{serverMsg}</p>}

            <div className="mt-4 grid grid-flow-col auto-cols-max gap-3">
              <button
                type="button"
                onClick={() => !loading && onClose()}
                className="rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition disabled:opacity-60"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:shadow-xl hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        opacity=".25"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="4"
                        opacity=".75"
                      />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="currentColor"
                    >
                      <path d="M19.5 7.2c0-3.6-3-5.2-6.4-5.2-2.2 0-4.4.6-6 1.6a.6.6 0 0 0-.3.53v2.26c0 .48.53.78.94.54 1.54-.9 3.36-1.45 5.16-1.45 1.7 0 2.7.64 2.7 1.69 0 2.58-8.2 1.06-8.2 6.22 0 3.05 2.63 4.86 6.24 4.86 2.1 0 4.1-.5 5.6-1.37.2-.11.33-.33.33-.57V13c0-.5-.53-.8-.95-.55-1.38.78-3.1 1.26-4.8 1.26-1.8 0-2.9-.63-2.9-1.65 0-2.8 8.2-1.14 8.2-6.86Z" />
                    </svg>
                    Save keys
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
