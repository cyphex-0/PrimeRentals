import { notFound } from "next/navigation";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, Star, User } from "lucide-react";
import { getServerPropertyById } from "@/lib/api/server";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { RentalRequestButton } from "@/components/rentals/rental-request-button";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { RelatedProperties } from "@/components/properties/related-properties";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const res = await getServerPropertyById(params.id);
  if (!res.data) return { title: "Property Not Found" };
  return { title: `${res.data.title} | RentNest` };
}

export default async function PropertyDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const res = await getServerPropertyById(params.id);
  if (!res.success || !res.data) return notFound();

  const property = res.data;
  const reviews = property.reviews || [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;

  return (
    <main className="container px-4 md:px-6 py-8">
      <div className="mb-8">
        <PropertyGallery images={property.images} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-3">{property.category?.name || "Property"}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">{property.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-1 text-primary" />
                  <span>{property.address}, {property.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6 mt-6 pb-6 border-b border-border/50">
              <div className="flex flex-col"><span className="text-2xl font-bold">{property.bedrooms}</span><span className="text-muted-foreground text-sm flex items-center gap-1"><Bed className="h-4 w-4"/> Beds</span></div>
              <div className="flex flex-col"><span className="text-2xl font-bold">{property.bathrooms}</span><span className="text-muted-foreground text-sm flex items-center gap-1"><Bath className="h-4 w-4"/> Baths</span></div>
              <div className="flex flex-col"><span className="text-2xl font-bold">{property.area}</span><span className="text-muted-foreground text-sm flex items-center gap-1"><Square className="h-4 w-4"/> Sqft</span></div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">About this property</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1.5 text-sm bg-muted/50 border-border/60">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              {averageRating > 0 ? averageRating.toFixed(1) : "No"} ({reviews.length} reviews)
            </h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar src={review.tenant?.profileImage || ""} fallback={review.tenant?.name?.charAt(0) || "U"} />
                    <div>
                      <p className="font-medium">{review.tenant?.name || "Anonymous User"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="bg-muted/30 border border-border/50 rounded-xl p-6 text-center">
                  <p className="text-muted-foreground">This property hasn&apos;t been reviewed yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-24 border border-border/50 bg-card rounded-2xl p-6 shadow-xl shadow-primary/5">
            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{formatPrice(property.rent)}</span>
              <span className="text-muted-foreground"> / month</span>
            </div>

            <RentalRequestButton propertyId={property.id} status={property.status} />

            <div className="mt-8 pt-6 border-t border-border/50">
              <h3 className="font-semibold mb-4 text-foreground">Listed by</h3>
              <div className="flex items-center gap-4">
                <Avatar 
                  className="h-12 w-12 border border-border/50 shadow-sm"
                  src={property.landlord?.profileImage || ""}
                  fallback={property.landlord?.name?.charAt(0) || "L"}
                />
                <div>
                  <p className="font-semibold">{property.landlord?.name || "Unknown Landlord"}</p>
                  <p className="text-sm text-muted-foreground">{property.landlord?.email || "No email provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProperties
        categoryId={property.categoryId}
        currentPropertyId={property.id}
        categoryName={property.category?.name || "Similar"}
      />
    </main>
  );
}
