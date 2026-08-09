import * as React from "react"
import Link from "next/link"
import { Home, Building2 } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Branding Panel (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-primary p-12 text-on-primary overflow-hidden relative">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight text-white">
            <Building2 className="h-6 w-6" />
            PrimeRentals
          </Link>
          <div className="mt-24 max-w-md">
            <h1 className="text-4xl font-bold leading-tight text-white mb-6">
              Your perfect rental journey starts here.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Join thousands of tenants and landlords experiencing the most seamless, transparent, and secure property rental process.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[120%] h-[60%] bg-white/10 rounded-t-[100%] blur-3xl mix-blend-overlay"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <Home className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>
        
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
    </div>
  )
}