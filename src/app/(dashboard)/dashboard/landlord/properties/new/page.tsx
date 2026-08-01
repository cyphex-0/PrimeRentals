"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useCreateProperty } from "@/hooks/api/use-landlord";
import { useCategories } from "@/hooks/api/use-categories";
import { createPropertySchema, CreatePropertyInput } from "@/lib/validations/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ImageUploader } from "@/components/properties/image-uploader";
import Link from "next/link";

const COMMON_AMENITIES = [
  "WiFi", "Parking", "Gym", "Pool", "AC", "Laundry", 
  "Elevator", "Security", "Balcony", "Pet Friendly"
];

export default function CreatePropertyPage() {
  const router = useRouter();
  const { mutate: createProperty, isPending } = useCreateProperty();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  
  const categories = categoriesData?.data || [];

  const { register, handleSubmit, control, formState: { errors }, watch, setValue, getValues } = useForm<CreatePropertyInput>({
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
  
  const selectedAmenities = watch("amenities");

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue("amenities", selectedAmenities.filter(a => a !== amenity), { shouldValidate: true });
    } else {
      setValue("amenities", [...selectedAmenities, amenity], { shouldValidate: true });
    }
  };

  const onSubmit = (data: CreatePropertyInput) => {
    // Filter out empty images just in case
    data.images = data.images.filter(img => img.trim() !== "");
    
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
              <ImageUploader 
                images={watch("images") || []} 
                onChange={(newImages) => setValue("images", newImages, { shouldValidate: true })}
                error={errors.images?.message}
              />
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
