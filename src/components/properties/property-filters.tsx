"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, FilterX } from "lucide-react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PropertyFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  // Sync state if URL changes externally (render-phase update)
  if (prevSearchParams.toString() !== searchParams.toString()) {
    setPrevSearchParams(searchParams);

    setSearch(searchParams.get("search") || "");
    setLocation(searchParams.get("location") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setCategoryId(searchParams.get("categoryId") || "");
    setSortBy(searchParams.get("sortBy") || "createdAt");
    setSortOrder(searchParams.get("sortOrder") || "desc");
  }

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    
    if (search) params.append("search", search);
    if (location) params.append("location", location);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (bedrooms) params.append("bedrooms", bedrooms);
    if (categoryId) params.append("categoryId", categoryId);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setCategoryId("");
    setSortBy("createdAt");
    setSortOrder("desc");
    router.push("/properties");
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <FilterX className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <form onSubmit={applyFilters} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Title, keyword..." 
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Location</label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="City, area..." 
              className="pl-9 h-9 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Min Price</label>
            <Input 
              type="number" 
              placeholder="$0" 
              min="0"
              className="h-9 text-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Max Price</label>
            <Input 
              type="number" 
              placeholder="$Any" 
              min="0"
              className="h-9 text-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Bedrooms</label>
          <Input 
            type="number" 
            placeholder="Any" 
            min="1"
            className="h-9 text-sm"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Sort By</label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-");
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="rent-asc">Price: Low to High</option>
            <option value="rent-desc">Price: High to Low</option>
          </select>
        </div>

        <Button type="submit" className="w-full mt-2">
          Apply Filters
        </Button>
      </form>
    </div>
  );
}
