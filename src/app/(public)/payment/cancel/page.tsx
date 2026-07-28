"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg text-center overflow-hidden">
        <div className="h-32 bg-red-500/10 flex items-center justify-center border-b border-red-500/20">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-base">
            Your transaction was cancelled or interrupted. No charges were made to your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            You can try completing the payment again from your rentals dashboard when you&apos;re ready.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.push("/dashboard/tenant/rentals")}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Go to Dashboard
          </Button>
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={() => router.back()}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
