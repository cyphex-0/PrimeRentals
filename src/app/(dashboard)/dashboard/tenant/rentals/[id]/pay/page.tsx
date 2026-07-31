"use client";

import { useEffect, useState } from "react";
import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";
import stripePromise from "@/lib/stripe";
import { useRentalRequest } from "@/hooks/api/use-rentals";
import { useCreatePaymentIntent } from "@/hooks/api/use-payments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils/format";

function CheckoutForm({ clientSecret, amount, onCancel }: { clientSecret: string, amount: string, onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // Get the base URL for the return
    const baseUrl = window.location.origin;
    
    // Construct return URL
    const returnUrl = `${baseUrl}/payment/success`;

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (stripeError) {
      setError(stripeError.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 md:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
        <Button 
          type="button" 
          variant="ghost" 
          className="w-full sm:w-1/3 h-12 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl font-medium" 
          disabled={isProcessing}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full sm:w-2/3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-xl font-semibold text-base transition-all"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Securely...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay {formatPrice(amount)}
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Payments are secure and encrypted by Stripe</span>
      </div>
    </form>
  );
}

// The Page Wrapper
export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { data, isLoading } = useRentalRequest(resolvedParams.id);
  const { mutate: createIntent, isPending: isCreatingIntent } = useCreatePaymentIntent();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  const rental = data?.data;

  useEffect(() => {
    if (rental && rental.status === "APPROVED" && !clientSecret && !isCreatingIntent && !setupError) {
      createIntent(
        { rentalRequestId: rental.id },
        {
          onSuccess: (res) => {
            if (res.data?.clientSecret) {
              setClientSecret(res.data.clientSecret);
            } else {
              setSetupError("Failed to initialize payment gateway.");
            }
          },
          onError: () => {
            setSetupError("Failed to create payment session. Please try again.");
          }
        }
      );
    }
  }, [rental, clientSecret, createIntent, isCreatingIntent, setupError]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center space-y-6">
        <div className="p-4 bg-primary/5 rounded-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">Preparing secure checkout...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center space-y-6 text-center px-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
          <CreditCard className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold">Request Not Found</h2>
        <p className="text-slate-500 max-w-sm">We couldn&apos;t find the rental request you&apos;re looking for. It may have been removed.</p>
        <Button size="lg" className="rounded-xl mt-4" onClick={() => router.push("/dashboard/tenant/rentals")}>Return to Rentals</Button>
      </div>
    );
  }

  if (rental.status !== "APPROVED") {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center space-y-6 text-center px-4">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-2 text-amber-600">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Payment Not Available</h2>
        <p className="text-slate-500 max-w-md">
          This rental request is currently <span className="font-semibold text-slate-700 dark:text-slate-300">{rental.status}</span>. 
          You can only make payments on APPROVED requests.
        </p>
        <Button size="lg" variant="outline" className="rounded-xl mt-4" onClick={() => router.push("/dashboard/tenant/rentals")}>Return to Rentals</Button>
      </div>
    );
  }

  const amount = rental.property?.rent || "0";

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8 px-4 md:px-6">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">Secure Checkout</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Complete your payment to finalize your lease agreement.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        {/* Payment Form (Left on Desktop, Bottom on Mobile) */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          {setupError ? (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl text-center space-y-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto text-red-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Connection Error</h3>
                <p className="text-red-700 dark:text-red-300">{setupError}</p>
              </div>
              <Button variant="outline" className="rounded-xl border-red-200 text-red-700 hover:bg-red-100" onClick={() => router.push("/dashboard/tenant/rentals")}>
                Go Back
              </Button>
            </div>
          ) : !clientSecret ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50 space-y-5 p-8 text-center shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div className="space-y-1">
                <h3 className="font-medium text-lg">Connecting to Stripe</h3>
                <p className="text-sm text-slate-500">Establishing a secure connection...</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50">Payment Method</h3>
                  <p className="text-sm text-slate-500">Enter your card details below</p>
                </div>
              </div>
              
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#0ea5e9', // Primary brand color
                      colorBackground: '#ffffff',
                      colorText: '#0f172a',
                      colorDanger: '#ef4444',
                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      spacingUnit: '4.5px',
                      borderRadius: '12px',
                      gridRowSpacing: '24px',
                    },
                    rules: {
                      '.Input': {
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      },
                      '.Input:focus': {
                        border: '1px solid #0ea5e9',
                        boxShadow: '0 0 0 1px #0ea5e9',
                      }
                    }
                  }
                }}
              >
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  amount={amount} 
                  onCancel={() => router.push("/dashboard/tenant/rentals")}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Order Summary (Right on Desktop, Top on Mobile) */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <Card className="border-0 shadow-2xl shadow-slate-200/40 dark:shadow-none dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 rounded-3xl overflow-hidden sticky top-24">
            <CardHeader className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800/80 pb-6 pt-7 px-7">
              <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              <CardDescription className="text-base mt-1">Review your lease details before paying.</CardDescription>
            </CardHeader>
            <CardContent className="pt-7 px-7 space-y-6">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Property</p>
                <p className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">{rental.property?.title}</p>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{rental.property?.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Move-in</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(rental.moveInDate)}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Move-out</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(rental.moveOutDate)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-primary/5 dark:bg-primary/10 border-t border-primary/10 flex flex-col items-stretch py-6 px-7 mt-2">
              <div className="flex items-end justify-between mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Total Due</span>
                <span className="text-3xl font-extrabold text-primary tracking-tight">{formatPrice(amount)}</span>
              </div>
              <p className="text-sm text-slate-500 text-right">Includes all applicable fees and taxes</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
