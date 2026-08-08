import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentNest",
  description: "Learn how RentNest collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[length:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Privacy
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
            We are committed to protecting your privacy and ensuring your personal data is handled securely and responsibly.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
            <h2 className="text-2xl font-bold mt-10 mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect information you provide directly to us when you register for an account, update your profile, submit a property listing, or process a payment. This may include your name, email address, phone number, billing information, and identification documents. We also automatically collect certain information about your device and how you interact with our platform.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the collected information to operate and improve the RentNest platform, process transactions, verify user identities, communicate with you regarding your account or listings, and provide customer support. We also use this data to detect and prevent fraud, abuse, and security incidents.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell your personal information. We only share your data with other users when necessary (e.g., sharing a tenant's profile with a landlord during a rental request), with service providers who perform services on our behalf (such as payment processors), or when required by law to respond to legal processes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">5. Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              RentNest uses cookies and similar tracking technologies to track the activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, though some features of the platform may not function properly without them.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, delete, or restrict the use of your information. You can exercise these rights by managing your account settings or contacting our privacy team.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our platform is not intended for use by anyone under the age of 18. We do not knowingly collect personally identifiable information from children. If we become aware that we have collected such data, we will take steps to remove that information from our servers.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at privacy@rentnest.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
