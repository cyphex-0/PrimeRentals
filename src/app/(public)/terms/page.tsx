import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | PrimeRentals",
  description: "Terms and conditions for using the PrimeRentals platform.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[length:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
            Please read these terms carefully before using the PrimeRentals platform to understand your rights and responsibilities.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing or using PrimeRentals (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use the Platform. These terms apply to all visitors, users, landlords, and tenants who access or use the Service.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">2. User Accounts & Registration</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You must register for an account to access most features of the Platform. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during the registration process.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">3. Property Listings</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Landlords are solely responsible for the accuracy and legality of their property listings. PrimeRentals reserves the right to remove any listing that violates these terms or is deemed inappropriate. Landlords must ensure they have the legal right to rent out the properties they list.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">4. Rental Requests & Agreements</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A rental request submitted by a tenant does not guarantee a lease. The landlord has the right to approve or reject requests. PrimeRentals is not a party to the actual rental agreement between the landlord and tenant, and we assume no liability for any disputes arising from the tenancy.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">5. Payments & Refunds</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All payments made through the Platform are processed securely via Stripe. By providing a payment method, you authorize us to charge the applicable fees. Refunds are subject to the specific rental agreement and local laws. PrimeRentals is not responsible for refunding payments once they have been transferred to the landlord.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">6. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, or impair the Platform. You must not submit false information, impersonate others, or engage in any fraudulent activities. We reserve the right to ban users who violate these conduct rules.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Platform and its original content, features, and functionality are owned by PrimeRentals and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, or distribute any part of the Platform without our explicit consent.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PrimeRentals provides the Platform "as is" and without warranty of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the Platform, including but not limited to any disputes between tenants and landlords.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Platform will immediately cease.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us at legal@primerentals.com or through our contact form.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
