"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMe, useUpdateProfile } from "@/hooks/api/use-auth";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: userData } = useMe();
  const user = userData?.data;
  const { mutate, isPending } = useUpdateProfile();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

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
              <Avatar 
                className="h-24 w-24 mb-4 border-2 border-border shadow-sm"
                src={(user as User).profileImage || ""}
                fallback={user.name?.charAt(0) || "U"}
              />
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
                    <label className="text-sm font-medium">Profile Image URL</label>
                    <Input 
                      placeholder="https://example.com/avatar.jpg"
                      {...register("profileImage")}
                      className={errors.profileImage ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
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
                  <Button type="submit" disabled={isPending} className="px-8 shadow-sm">
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
