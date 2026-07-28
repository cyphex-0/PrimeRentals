const fs = require('fs');
const path = require('path');

const writeIfMissing = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim());
};

// 1. Providers (React Query + Toaster)
writeIfMissing(path.join(__dirname, '../src/components/providers.tsx'), `
"use client";

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
`);

// 2. Root Layout
writeIfMissing(path.join(__dirname, '../src/app/layout.tsx'), `
import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RentNest - Property Rental Marketplace",
  description: "Find and rent your perfect property on RentNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={\`\${lexend.variable} \${sourceSans.variable} font-sans antialiased min-h-screen flex flex-col\`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
`);

// 3. Public Layout
writeIfMissing(path.join(__dirname, '../src/app/(public)/layout.tsx'), `
import * as React from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
`);

// Public Page
writeIfMissing(path.join(__dirname, '../src/app/(public)/page.tsx'), `
import * as React from "react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center animate-in fade-in zoom-in duration-500">
      <h1 className="font-heading text-5xl font-bold tracking-tight text-primary mb-6">Welcome to RentNest</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
        Your trusted marketplace for modern, professional property rentals. 
        Find your perfect home or list your property with confidence.
      </p>
    </div>
  )
}
`);

// 4. Auth Layout
writeIfMissing(path.join(__dirname, '../src/app/(auth)/layout.tsx'), `
import * as React from "react"
import Link from "next/link"
import { Home } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
        <Home className="h-5 w-5" />
        <span className="font-medium">Back to Home</span>
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
`);

// 5. Dashboard Layout
writeIfMissing(path.join(__dirname, '../src/app/(dashboard)/layout.tsx'), `
import * as React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Mock role for UI development. In real app, this comes from auth context/session.
  const role = "TENANT";

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
`);

// Also, need to remove the default src/app/page.tsx so that (public)/page.tsx takes over the root URL.
const defaultPage = path.join(__dirname, '../src/app/page.tsx');
if (fs.existsSync(defaultPage)) {
  fs.unlinkSync(defaultPage);
}

console.log("App Layouts and Providers generated successfully.");
