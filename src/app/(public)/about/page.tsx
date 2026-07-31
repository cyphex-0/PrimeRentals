import { Users, Shield, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[length:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
            Redefining the Rental Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
            At RentNest, we believe that finding a home should be as comfortable as living in one. 
            We bridge the gap between property owners and tenants with trust, transparency, and technology.
          </p>
        </div>
      </section>

      {/* Stats/Values Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-muted-foreground">We prioritize the needs of our community, ensuring every interaction adds value to both tenants and landlords.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trust & Security</h3>
              <p className="text-muted-foreground">Every property and user is verified. We maintain the highest standards of security for a safe rental environment.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seamless Process</h3>
              <p className="text-muted-foreground">From discovering properties to signing leases and making payments, everything is streamlined and digital.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
