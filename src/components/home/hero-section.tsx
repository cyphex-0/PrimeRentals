"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-[60vh] max-h-[70vh] flex items-center">
      {/* Background gradients & shapes */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute top-48 -left-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"></div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Find Your <span className="text-primary">Perfect</span> Rental Home
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              Browse thousands of verified properties. Request to rent in minutes and move in with confidence.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSearch}
            className="w-full max-w-3xl flex flex-col sm:flex-row gap-2 bg-card p-3 rounded-2xl shadow-lg border border-border/50"
          >
            <div className="flex-1 flex items-center relative bg-background rounded-xl border border-border px-3">
              <Search className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by title, keyword..."
                className="w-full h-12 bg-transparent outline-none placeholder:text-muted-foreground"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center relative bg-background rounded-xl border border-border px-3">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              <input
                type="text"
                placeholder="City, neighborhood, or address"
                className="w-full h-12 bg-transparent outline-none placeholder:text-muted-foreground"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-xl shrink-0 bg-accent hover:bg-accent/90 text-white font-semibold">
              Search Properties
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 pt-4 text-sm font-medium text-muted-foreground"
          >
            <span>Popular:</span>
            <div className="flex gap-2">
              <span className="cursor-pointer hover:text-primary transition-colors bg-muted px-3 py-1 rounded-full">New York</span>
              <span className="cursor-pointer hover:text-primary transition-colors bg-muted px-3 py-1 rounded-full">Apartments</span>
              <span className="cursor-pointer hover:text-primary transition-colors bg-muted px-3 py-1 rounded-full">Pet Friendly</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
