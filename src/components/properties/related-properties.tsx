import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { getServerProperties } from "@/lib/api/server";

import { Property } from "@/lib/types";

interface RelatedPropertiesProps {
  categoryId: string;
  currentPropertyId: string;
  categoryName: string;
}

export async function RelatedProperties({ categoryId, currentPropertyId, categoryName }: RelatedPropertiesProps) {
  let related: Property[] = [];
  
  try {
    const response = await getServerProperties(`categoryId=${categoryId}&limit=4`);
    const properties = response.data || [];
    
    // Filter out the current property and take exactly 3
    related = properties.filter((p) => p.id !== currentPropertyId).slice(0, 3);
  } catch (error) {
    return null;
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-16 border-t border-border/50">
      <h2 className="text-2xl font-semibold mb-6">More {categoryName} Properties</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((property) => (
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
                    {property.category?.name || categoryName}
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
                <div className="mt-5 border-t border-border/50 pt-4 flex items-center justify-between">
                  <div className="text-xl font-bold text-foreground">
                    {formatPrice(property.rent)}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-full px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    {property.reviews && property.reviews.length > 0 ? (
                      <span>
                        {(property.reviews.reduce((acc, rev) => acc + rev.rating, 0) / property.reviews.length).toFixed(1)}{" "}
                        <span className="font-normal opacity-80">({property.reviews.length})</span>
                      </span>
                    ) : (
                      <span className="font-normal opacity-80">New</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
