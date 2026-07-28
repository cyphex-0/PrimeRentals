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

// The Checkout Form component
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

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/payment/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-border/50 rounded-xl bg-card">
        <PaymentElement />
      </div>
      
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full" 
          disabled={isProcessing}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {formatPrice(amount)}
            </>
          )}
        </Button>
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
    if (rental && rental.status === "APPROVED" && !clientSecret && !isCreatingIntent) {
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
  }, [rental, clientSecret, createIntent, isCreatingIntent]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading payment details...</p>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <p className="text-muted-foreground">Rental request not found.</p>
        <Button onClick={() => router.push("/dashboard/tenant/rentals")}>Return to Rentals</Button>
      </div>
    );
  }

  if (rental.status !== "APPROVED") {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <p className="text-muted-foreground">This rental is not in APPROVED status. Current status: {rental.status}</p>
        <Button onClick={() => router.push("/dashboard/tenant/rentals")}>Return to Rentals</Button>
      </div>
    );
  }

  const amount = rental.property?.rent || "0";

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Secure Payment</h1>
        <p className="text-muted-foreground mt-1">Complete your payment to finalize your lease.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Payment Summary */}
        <div>
          <Card className="bg-card shadow-sm border-border/50 sticky top-24">
            <CardHeader className="border-b border-border/50 pb-6">
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your lease details before paying.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Property</p>
                <p className="font-semibold text-foreground">{rental.property?.title}</p>
                <p className="text-sm text-muted-foreground">{rental.property?.address}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Move-in Date</p>
                  <p className="font-medium">{formatDate(rental.moveInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Move-out Date</p>
                  <p className="font-medium">{formatDate(rental.moveOutDate)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 flex items-center justify-between py-4">
              <span className="font-medium">Total Amount Due</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(amount)}</span>
            </CardFooter>
          </Card>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure, encrypted payment processing</span>
          </div>
        </div>

        {/* Stripe Elements Form */}
        <div>
          {setupError ? (
            <div className="p-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-center space-y-4">
              <p>{setupError}</p>
              <Button variant="outline" onClick={() => router.push("/dashboard/tenant/rentals")}>
                Go Back
              </Button>
            </div>
          ) : !clientSecret ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] border border-border/50 rounded-xl bg-card space-y-4 p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Connecting to secure payment gateway...</p>
            </div>
          ) : (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#0f172a',
                    colorBackground: '#ffffff',
                    colorText: '#0f172a',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                  }
                }
              }}
            >
              <div className="p-1">
                <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  amount={amount} 
                  onCancel={() => router.push("/dashboard/tenant/rentals")}
                />
              </div>
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
