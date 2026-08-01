"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error";

import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = React.useState(false);
  
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await loginUser(data);
      if (res.success && res.data) {
        setAuth(res.data.token);
        queryClient.clear();
        router.refresh();
        toast.success("Welcome back!");
        
        const role = res.data.user.role;
        if (role === "TENANT") router.push("/dashboard/tenant");
        else if (role === "LANDLORD") router.push("/dashboard/landlord");
        else router.push("/dashboard/admin");
      }
    } catch (error: unknown) {
      const message = sanitizeErrorMessage(error) || "Failed to login. Please check your credentials.";
      setError("root", { message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{errors.root.message}</p>
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">Password</label>
          </div>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              {...register("password")}
              className={errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
