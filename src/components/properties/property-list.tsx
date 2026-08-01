"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Property, PaginationMeta } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PropertyList({ properties, meta }: { properties: Property[], meta?: PaginationMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!properties.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-border/50">
        <div className="bg-muted p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No properties found</h3>
        <p className="text-muted-foreground mb-6">We couldn&apos;t find any properties matching your filters.</p>
        <Button onClick={() => router.push("/properties")} variant="outline">
          Clear all filters
        </Button>
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {properties.length} {meta?.total ? `of ${meta.total}` : ""} properties
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link key={property.id} href={`/properties/${property.id}`} className="group block">
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-background/95 text-foreground border-border/80 backdrop-blur-md shadow-md font-semibold px-3 py-1">
                    {property.category?.name || "Property"}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-muted-foreground mt-2 text-sm">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Bed className="h-4 w-4"/> {property.bedrooms}</div>
                  <div className="flex items-center gap-1"><Bath className="h-4 w-4"/> {property.bathrooms}</div>
                  <div className="flex items-center gap-1"><Square className="h-4 w-4"/> {property.area} sqft</div>
                </div>
                <div className="mt-5 border-t pt-4 flex items-center justify-between">
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(property.rent)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {meta && meta.total > meta.limit && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            disabled={meta.page <= 1}
            onClick={() => handlePageChange(meta.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
          </span>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={meta.page >= Math.ceil(meta.total / meta.limit)}
            onClick={() => handlePageChange(meta.page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Add Search icon import that was missing above
import { Search } from "lucide-react";
