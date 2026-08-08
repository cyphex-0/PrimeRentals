import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | RentNest",
  description: "Frequently asked questions about RentNest platform and services.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I register an account?",
      answer: "You can register by clicking the 'Sign up' button in the top right corner. You'll need to choose whether you want to register as a Tenant or a Landlord, and provide your basic information.",
    },
    {
      question: "How do I list a property?",
      answer: "Once registered as a Landlord, navigate to your dashboard and click 'Add New Property'. Fill out the property details, upload images, and set your rental price. The listing will be live instantly after submission.",
    },
    {
      question: "How does the Stripe payment system work?",
      answer: "We use Stripe for secure payment processing. When a rental request is approved, tenants can pay their rent directly through our platform. The funds are securely transferred to the landlord's account.",
    },
    {
      question: "What is your refund policy?",
      answer: "Refunds are handled on a case-by-case basis between the tenant and landlord, subject to the terms of the specific rental agreement signed prior to move-in.",
    },
    {
      question: "How do rental requests work?",
      answer: "Tenants can browse available properties and submit a rental request. Landlords receive a notification and can review the tenant's profile before approving or rejecting the request.",
    },
    {
      question: "What is the typical approval timeline?",
      answer: "Landlords usually respond to rental requests within 24-48 hours. You will receive an email and dashboard notification once a decision is made.",
    },
    {
      question: "How can I update my profile?",
      answer: "Log in to your account and go to the Profile section in your dashboard. From there, you can update your personal information, contact details, and profile picture.",
    },
    {
      question: "How is my data protected?",
      answer: "We employ industry-standard encryption and security protocols to protect all user data. Your payment information is securely handled by Stripe and is never stored on our servers.",
    },
    {
      question: "Are property listings verified?",
      answer: "Yes, we have a verification process for landlords to ensure the authenticity of their listings. We prioritize community trust and actively monitor for suspicious activities.",
    },
    {
      question: "What are your customer support hours?",
      answer: "Our customer support team is available Monday through Friday, 9:00 AM to 6:00 PM EST. We typically respond to all inquiries within 24 hours.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[length:30px_30px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150 fill-mode-both">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
            Find answers to common questions about using RentNest, managing properties, and processing payments.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-border/50 py-5">
                <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center outline-none">
                  {faq.question}
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
