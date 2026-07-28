"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/5 skew-y-3 origin-bottom-right -z-10"></div>
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border/50 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-700"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">Ready to find your next home?</h2>
            <p className="text-lg text-muted-foreground mb-10">
              Join our community today. Whether you&apos;re looking for a cozy studio or listing your luxury villa, RentNest connects you instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/properties">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
