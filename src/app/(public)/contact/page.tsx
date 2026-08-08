"use client";

import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { contactSchema, ContactInput } from "@/lib/validations/contact"
import { submitContactForm } from "@/lib/api"
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error"

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactInput) => {
    try {
      const response = await submitContactForm(data);
      if (response.success) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error(response.message || "Failed to send message");
      }
    } catch (error) {
      toast.error(sanitizeErrorMessage(error));
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Get in Touch</h1>
              <p className="text-lg text-muted-foreground">We&apos;re here to help. Reach out to our team for any inquiries.</p>
            </div>
            
            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
              {/* Contact Info */}
              <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-150 fill-mode-both">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Headquarters</h3>
                    <p className="text-muted-foreground">123 RentNest Avenue<br/>Tech District, NY 10001</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                    <p className="text-muted-foreground">support@rentnest.com<br/>partnerships@rentnest.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm EST</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="md:col-span-3 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                        <Input id="firstName" placeholder="John" className="bg-slate-50 dark:bg-slate-950" {...register("firstName")} />
                        {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                        <Input id="lastName" placeholder="Doe" className="bg-slate-50 dark:bg-slate-950" {...register("lastName")} />
                        {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-slate-50 dark:bg-slate-950" {...register("email")} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] bg-slate-50 dark:bg-slate-950" {...register("message")} />
                      {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
