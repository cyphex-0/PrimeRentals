"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-background">
      <div className="bg-destructive/10 p-6 rounded-full mb-6 shadow-sm">
        <AlertCircle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">Something went wrong!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. We&apos;ve been notified and are working to fix the issue.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" onClick={() => reset()} className="h-12 px-8 shadow-md">
          Try again
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.location.href = "/"} className="h-12 px-8">
          Return Home
        </Button>
      </div>
    </div>
  );
}
