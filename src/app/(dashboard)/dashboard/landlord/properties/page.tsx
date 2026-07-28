"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, MapPin, Search } from "lucide-react";
import { useLandlordProperties, useDeleteProperty } from "@/hooks/api/use-landlord";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function MyPropertiesPage() {
  const router = useRouter();
  const { data, isLoading } = useLandlordProperties();
  const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();

  const [searchQuery, setSearchQuery] = useState("");
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const properties = data?.data || [];

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete, {
        onSuccess: () => {
          setPropertyToDelete(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your listed rental properties.</p>
        </div>
        <Button asChild className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Property
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground absolute ml-3" />
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-xl">
          <Building2Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground mb-6">You haven&apos;t listed any properties yet.</p>
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Property
            </Link>
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-xl">
          <p className="text-muted-foreground">No properties match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-muted overflow-hidden">
                <Image
                  src={property.images[0] || "/placeholder.jpg"}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={property.status} type="PropertyStatus" className="shadow-sm" />
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1 flex-1" title={property.title}>
                    {property.title}
                  </h3>
                  <p className="font-bold text-primary shrink-0">{formatPrice(property.rent)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5 mr-1 shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-medium bg-muted/30 p-2.5 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Requests</span>
                    <span>{property._count?.rentalRequests || 0}</span>
                  </div>
                  <div className="w-px h-6 bg-border"></div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Reviews</span>
                    <span>{property._count?.reviews || 0}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => router.push(`/dashboard/landlord/properties/${property.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-none px-3 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                  onClick={() => setPropertyToDelete(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!propertyToDelete} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your property. You cannot delete a property if it has active or pending rental requests.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setPropertyToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Icon for empty state
function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}
