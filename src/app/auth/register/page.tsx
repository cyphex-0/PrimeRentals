"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User as UserIcon, Building } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TENANT",
    }
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await registerUser(data);
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);
        toast.success("Account created successfully!");
        
        const role = res.data.user.role;
        if (role === "TENANT") router.push("/dashboard/tenant");
        else if (role === "LANDLORD") router.push("/dashboard/landlord");
        else router.push("/dashboard/admin");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to register. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Choose your account type and fill in your details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-medium leading-none">I am a...</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => field.onChange("TENANT")}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                    field.value === "TENANT" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border text-muted-foreground"
                  )}
                >
                  <UserIcon className="h-6 w-6" />
                  <span className="font-medium">Tenant</span>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("LANDLORD")}
                  className={cn(
                    "flex flex-col items-center justify-center space-y-2 rounded-xl border-2 p-4 transition-all hover:bg-muted/50",
                    field.value === "LANDLORD" 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border text-muted-foreground"
                  )}
                >
                  <Building className="h-6 w-6" />
                  <span className="font-medium">Landlord</span>
                </button>
              </div>
            )}
          />
          {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Full Name</label>
          <Input 
            placeholder="John Doe" 
            {...register("name")}
            className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Email</label>
          <Input 
            type="email" 
            placeholder="name@example.com" 
            {...register("email")}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Password</label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            {...register("password")}
            className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
