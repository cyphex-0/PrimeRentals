"use client";

import { motion } from "framer-motion";
import { Search, FileSignature, KeyRound } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse Properties",
      description: "Explore thousands of verified listings tailored to your needs and lifestyle.",
    },
    {
      icon: FileSignature,
      title: "Request to Rent",
      description: "Submit a rental request directly to the landlord in a few simple clicks.",
    },
    {
      icon: KeyRound,
      title: "Move In",
      description: "Once approved, securely pay your rent and get the keys to your new home.",
    },
  ];

  return (
    <section className="py-24 bg-primary text-on-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
      <div className="container px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">How PrimeRentals Works</h2>
          <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
            Your journey to a new home should be as seamless as living in it. We&apos;ve simplified the process into three easy steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-white/20"></div>
          
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center mb-6 shadow-xl relative z-10 hover:scale-110 transition-transform duration-300">
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
              <p className="text-white/80">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
