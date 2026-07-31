"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentHistory, useConfirmPayment } from "@/hooks/api/use-payments";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils/format";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");

  const { data: paymentsData, isLoading: isLoadingPayments } = usePaymentHistory();
  const { mutate: confirmPayment, isPending: isConfirming, isSuccess, isError } = useConfirmPayment();
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const payments = paymentsData?.data || [];

  useEffect(() => {
    if (!paymentIntent || isLoadingPayments || hasConfirmed || isConfirming || isSuccess) return;



    // Fallback: Find the backend payment ID using the Stripe transaction ID
    const matchingPayment = payments.find(p => p.transactionId === paymentIntent);

    if (matchingPayment && matchingPayment.status === "PENDING") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasConfirmed(true);
      confirmPayment({ paymentId: matchingPayment.id });
    }
  }, [paymentIntent, payments, isLoadingPayments, hasConfirmed, isConfirming, isSuccess, confirmPayment]);

  if (!paymentIntent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-muted-foreground">Invalid payment session.</p>
        <Button onClick={() => router.push("/dashboard/tenant/rentals")}>Go to Dashboard</Button>
      </div>
    );
  }

  // Find the matched payment to display details (optional for display)
  const matchedPayment = payments.find(p => p.transactionId === paymentIntent);

  const isErrorState = isError || (!isLoadingPayments && !isConfirming && !isSuccess && matchedPayment?.status !== "COMPLETED");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg text-center overflow-hidden">
        <div className={`h-32 flex items-center justify-center border-b ${isErrorState ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
          <div className="relative">
            {isConfirming || isLoadingPayments ? (
              <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            ) : isSuccess || (matchedPayment?.status === "COMPLETED") ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            ) : isErrorState ? (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </div>
            ) : (
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            )}
          </div>
        </div>
        
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl">
            {isConfirming || isLoadingPayments ? "Verifying Payment..." : 
             isErrorState ? "Verification Failed" : "Payment Successful!"}
          </CardTitle>
          <CardDescription className="text-base">
            {isConfirming || isLoadingPayments ? (
              "Please wait while we confirm your payment with the server."
            ) : isErrorState ? (
              "We received your payment but failed to verify it. Please contact support."
            ) : (
              "Your transaction has been securely processed."
            )}
          </CardDescription>
        </CardHeader>

        {(isSuccess || matchedPayment?.status === "COMPLETED") && matchedPayment && (
          <CardContent>
            <div className="bg-muted/30 rounded-xl p-4 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-semibold text-foreground">{formatPrice(matchedPayment.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs text-foreground truncate max-w-[150px]" title={matchedPayment.transactionId}>
                  {matchedPayment.transactionId}
                </span>
              </div>
              {matchedPayment.rentalRequest?.property?.title && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {matchedPayment.rentalRequest.property.title}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="flex-col gap-3 pt-6">
          <Button 
            className="w-full" 
            onClick={() => router.push("/dashboard/tenant/rentals")}
            disabled={isConfirming || isLoadingPayments}
          >
            Go to My Rentals
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading payment details...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
