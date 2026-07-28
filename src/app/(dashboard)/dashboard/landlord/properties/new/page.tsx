"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useCreateProperty } from "@/hooks/api/use-landlord";
import { useCategories } from "@/hooks/api/use-categories";
import { createPropertySchema, CreatePropertyInput } from "@/lib/validations/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const COMMON_AMENITIES = [
  "WiFi", "Parking", "Gym", "Pool", "AC", "Laundry", 
  "Elevator", "Security", "Balcony", "Pet Friendly"
];

export default function CreatePropertyPage() {
  const router = useRouter();
  const { mutate: createProperty, isPending } = useCreateProperty();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  
  const categories = categoriesData?.data || [];

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm<CreatePropertyInput>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      address: "",
      rent: 0,
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      categoryId: "",
      amenities: [],
      images: [""],
    }
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as never, // cast to workaround strict typing for arrays of primitives
  });
  
  // Hack for react-hook-form string array
  const handleAddImage = () => {
    const currentImages = watch("images");
    setValue("images", [...currentImages, ""]);
  };
  const handleRemoveImage = (index: number) => {
    const currentImages = watch("images");
    setValue("images", currentImages.filter((_, i) => i !== index));
  };
  const updateImage = (index: number, value: string) => {
    const currentImages = [...watch("images")];
    currentImages[index] = value;
    setValue("images", currentImages);
  };

  const selectedAmenities = watch("amenities");

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue("amenities", selectedAmenities.filter(a => a !== amenity), { shouldValidate: true });
    } else {
      setValue("amenities", [...selectedAmenities, amenity], { shouldValidate: true });
    }
  };

  const onSubmit = (data: CreatePropertyInput) => {
    // Filter out empty images
    data.images = data.images.filter(img => img.trim() !== "");
    if (data.images.length === 0) {
      data.images = ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]; // Fallback if they manage to submit empty
    }
    
    createProperty(data, {
      onSuccess: () => {
        router.push("/dashboard/landlord/properties");
      }
    });
  };

  const currentImages = watch("images");

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/landlord/properties">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground mt-1">List a new property to start receiving rental requests.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your property.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="E.g. Modern Apartment in Downtown" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  placeholder="Describe your property in detail..." 
                  className="min-h-[120px]"
                  {...register("description")} 
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location (City/Area)</label>
                  <Input placeholder="E.g. New York, NY" {...register("location")} />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Address</label>
                  <Input placeholder="E.g. 123 Main St, Apt 4B" {...register("address")} />
                  {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("categoryId")}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
              <CardDescription>Size, rooms, and pricing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Rent ($)</label>
                  <Input type="number" min="0" step="0.01" {...register("rent", { valueAsNumber: true })} />
                  {errors.rent && <p className="text-sm text-destructive">{errors.rent.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area (sq ft)</label>
                  <Input type="number" min="0" {...register("area", { valueAsNumber: true })} />
                  {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bedrooms</label>
                  <Input type="number" min="1" {...register("bedrooms", { valueAsNumber: true })} />
                  {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bathrooms</label>
                  <Input type="number" min="1" {...register("bathrooms", { valueAsNumber: true })} />
                  {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select the amenities available at your property.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map(amenity => (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedAmenities.includes(amenity) 
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                        : 'bg-background hover:bg-muted text-muted-foreground border-border/50'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
              {errors.amenities && <p className="text-sm text-destructive mt-3">{errors.amenities.message}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Provide URLs for property images. First image will be the cover.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {currentImages.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="https://..." 
                        value={img}
                        onChange={(e) => updateImage(index, e.target.value)}
                      />
                      {errors.images?.[index] && <p className="text-xs text-destructive">{errors.images[index]?.message}</p>}
                    </div>
                    {currentImages.length > 1 && (
                      <Button type="button" variant="outline" className="shrink-0 px-3 text-destructive" onClick={() => handleRemoveImage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {errors.images && !errors.images.length && <p className="text-sm text-destructive">{errors.images.message}</p>}
                <Button type="button" variant="outline" onClick={handleAddImage} className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" /> Add Another Image URL
                </Button>
              </div>

              {/* Previews */}
              {currentImages.some(img => img.length > 0) && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Image Previews</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentImages.map((img, index) => (
                      img ? (
                        <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-muted border border-border/50 group">
                          <img 
                            src={img} 
                            alt={`Preview ${index}`} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                            }}
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded shadow-sm font-medium">
                              Cover
                            </div>
                          )}
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/50 py-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="bg-primary shadow-sm hover:shadow-md">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                List Property
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
