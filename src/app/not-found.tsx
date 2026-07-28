import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-background">
      <div className="bg-primary/10 p-6 rounded-full mb-6 shadow-sm">
        <Search className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link href="/">
        <Button size="lg" className="h-12 px-8 shadow-md">Return Home</Button>
      </Link>
    </div>
  );
}
