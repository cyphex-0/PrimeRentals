import { getServerProperties, getServerCategories } from "@/lib/api/server";
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { HowItWorks } from "@/components/home/how-it-works";
import { StatsSection } from "@/components/home/stats-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";

export const metadata = {
  title: "RentNest - Find Your Perfect Rental Home",
  description: "Browse thousands of verified properties. Request to rent in minutes.",
};

export default async function HomePage() {
  const [propertiesRes, categoriesRes] = await Promise.all([
    getServerProperties("limit=6&sortBy=createdAt&sortOrder=desc"),
    getServerCategories()
  ]);

  const featuredProperties = propertiesRes.data || [];
  const categories = categoriesRes.data || [];

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProperties properties={featuredProperties} />
      <StatsSection />
      <HowItWorks />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}