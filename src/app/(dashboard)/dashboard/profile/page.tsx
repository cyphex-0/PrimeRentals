"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User as UserIcon, Camera, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe, useUpdateProfile } from "@/hooks/api/use-auth";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations/auth";
import { uploadImageToImgBB } from "@/lib/utils/upload-image";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: userData } = useMe();
  const user = userData?.data;
  const { mutate, isPending } = useUpdateProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  const currentImage = watch("profileImage") ?? (user as User)?.profileImage ?? "";

  useEffect(() => {
    if (user) {
      const fullUser = user as User;
      reset({
        name: fullUser.name || "",
        phone: fullUser.phone || "",
        address: fullUser.address || "",
        profileImage: fullUser.profileImage || "",
      });
    }
  }, [user, reset]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError(null);

    // Validate file size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      const errMsg = `Image '${file.name}' exceeds the 5 MB size limit.`;
      setUploadError(errMsg);
      toast.error(errMsg);
      e.target.value = "";
      return;
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      const errMsg = "Only JPG, PNG, and WebP image formats are allowed.";
      setUploadError(errMsg);
      toast.error(errMsg);
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading profile photo to cloud...");
      const result = await uploadImageToImgBB(file);
      setValue("profileImage", result.url, { shouldValidate: true, shouldDirty: true });
      toast.success("Photo uploaded successfully! Remember to click Save Changes below.");
    } catch (err: unknown) {
      const errorText = sanitizeErrorMessage(err) || "Failed to upload photo.";
      setUploadError(errorText);
      toast.error(errorText);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = (data: UpdateProfileInput) => {
    mutate(data);
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account details and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card shadow-sm border-border/50">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <Avatar 
                  className="h-28 w-28 border-2 border-border shadow-md transition-all group-hover:opacity-95"
                  src={currentImage || ""}
                  fallback={user.name?.charAt(0) || "U"}
                />
                <label 
                  htmlFor="avatar-upload-card"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center justify-center"
                  title="Upload Photo"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </label>
                <input 
                  id="avatar-upload-card" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  disabled={isUploading}
                  onChange={handleImageChange} 
                />
              </div>
              <h2 className="font-bold text-xl">{user.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
              <Badge variant="secondary" className="px-3 uppercase tracking-wider text-xs">
                {user.role}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <Card className="bg-card shadow-sm border-border/50">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input 
                      {...register("name")}
                      className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input 
                      value={user.email} 
                      disabled 
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      placeholder="+1 (555) 000-0000"
                      {...register("phone")}
                      className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Profile Image</label>
                      <label 
                        htmlFor="avatar-upload-form"
                        className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin inline" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3 inline" /> Upload File
                          </>
                        )}
                      </label>
                      <input 
                        id="avatar-upload-form" 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        className="hidden" 
                        disabled={isUploading}
                        onChange={handleImageChange} 
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://example.com/avatar.jpg"
                        {...register("profileImage")}
                        disabled={isUploading}
                        className={errors.profileImage || uploadError ? "border-destructive focus-visible:ring-destructive" : ""}
                      />
                      {currentImage ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Remove Photo"
                          onClick={() => {
                            setValue("profileImage", "", { shouldValidate: true, shouldDirty: true });
                            setUploadError(null);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                        </Button>
                      ) : null}
                    </div>
                    {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
                    {errors.profileImage && <p className="text-xs text-destructive">{errors.profileImage.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Home Address</label>
                  <Input 
                    placeholder="123 Main St, City, Country"
                    {...register("address")}
                    className={errors.address ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                </div>

                <div className="pt-4 flex justify-end border-t border-border/50 mt-6 pt-6">
                  <Button type="submit" disabled={isPending || isUploading} className="px-8 shadow-sm">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
