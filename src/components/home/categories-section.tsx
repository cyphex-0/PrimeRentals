"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Home, Warehouse, Building, Palmtree, Trees } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoriesSectionProps {
  categories: Category[];
}

const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("apartment")) return <Building2 className="h-8 w-8" />;
  if (lowerName.includes("house")) return <Home className="h-8 w-8" />;
  if (lowerName.includes("villa") || lowerName.includes("resort")) return <Palmtree className="h-8 w-8" />;
  if (lowerName.includes("cabin") || lowerName.includes("wood")) return <Trees className="h-8 w-8" />;
  if (lowerName.includes("studio") || lowerName.includes("loft")) return <Warehouse className="h-8 w-8" />;
  return <Building className="h-8 w-8" />;
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories.length) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Explore Categories</h2>
            <p className="text-muted-foreground">Find properties that suit your unique lifestyle.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/properties?categoryId=${category.id}`}>
                <div className="flex flex-col items-center justify-center p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-md hover:bg-primary/5 transition-all group cursor-pointer text-center h-full">
                  <div className="text-primary/70 group-hover:text-primary transition-colors mb-4 group-hover:scale-110 duration-300">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
