"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Tenant",
    content: "RentNest made finding my dream apartment incredibly easy. The whole process from browsing to payment was seamless.",
  },
  {
    id: 2,
    name: "James K.",
    role: "Landlord",
    content: "Managing my properties has never been simpler. The dashboard gives me everything I need at a glance.",
  },
  {
    id: 3,
    name: "Emily R.",
    role: "Tenant",
    content: "I was amazed by how quick the approval process was. Within days, I had the keys to my new home.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          >
            What Our Users Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Real experiences from tenants and landlords who use RentNest.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="flex text-amber-500 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-muted-foreground italic mb-6 flex-grow">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
