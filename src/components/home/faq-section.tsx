"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I list my property on PrimeRentals?",
    answer: "Simply register as a landlord, navigate to your dashboard, and click 'Add New Property'. Fill in the details, upload photos, and your listing will be live instantly."
  },
  {
    question: "Is PrimeRentals free to use for tenants?",
    answer: "Yes! Browsing properties and submitting rental requests is completely free for tenants. You only pay when your rental request is approved and you proceed with the payment."
  },
  {
    question: "How are payments processed?",
    answer: "All payments are processed securely through Stripe. Your payment information is encrypted and never stored on our servers."
  },
  {
    question: "Can I cancel a rental request?",
    answer: "Pending rental requests can be managed from your tenant dashboard. Once a request is approved and payment is made, our standard rental agreement terms apply."
  },
  {
    question: "How does the landlord approval process work?",
    answer: "When a tenant submits a rental request, the landlord receives a notification and can review the request details. They can then approve or reject the request from their dashboard."
  },
  {
    question: "What happens after my rental period ends?",
    answer: "Once your rental period is complete, the landlord marks the rental as completed. You'll then have the opportunity to leave a review for the property."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Find answers to common questions about using PrimeRentals.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-border/50 py-4"
            >
              <button
                onClick={() => toggleOpen(index)}
                className="flex w-full items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
