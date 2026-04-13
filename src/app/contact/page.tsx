import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSiteSection } from "@/lib/site-config";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const cfg = await getSiteSection("contact");
  const contactInfo = [
    { icon: <MapPin size={18} className="text-gold" />, label: "Address", value: cfg.address },
    { icon: <Phone size={18} className="text-gold" />, label: "Phone", value: cfg.phone },
    { icon: <Mail size={18} className="text-gold" />, label: "Email", value: cfg.email },
    { icon: <Clock size={18} className="text-gold" />, label: "Office Hours", value: cfg.office_hours },
  ];
  return (
    <>
      <div className="bg-gradient-to-br from-navy via-ocean to-teal text-white px-6 py-14">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-gold/20 border border-gold/35 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Contact Us
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-white/55 text-base max-w-xl">
            Our admissions team is available Monday–Friday. For urgent queries, use our AI chatbot
            available 24/7.
          </p>
        </div>
      </div>
      <div className="divbar" />

      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-10">
        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <h2 className="font-cinzel text-navy text-xl font-bold mb-6">Send a Message</h2>
          <ContactForm />
        </div>

        {/* Contact details */}
        <div className="space-y-5">
          <div className="bg-navy rounded-2xl p-6 text-white">
            <h2 className="font-cinzel text-gold font-bold text-lg mb-5">Contact Details</h2>
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">{c.icon}</div>
                  <div>
                    <div className="text-white/45 text-xs uppercase tracking-wide">{c.label}</div>
                    <div className="text-white text-sm font-medium mt-0.5">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-white/10">
              <div className="text-white/45 text-xs uppercase tracking-wide mb-1">Emergency (24/7)</div>
              <div className="text-gold font-bold text-base">{cfg.emergency_phone}</div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-cinzel text-navy font-bold text-base mb-3">Faster Answers with AI</h3>
            <p className="text-muted text-sm mb-4">
              Our Claude AI-powered chatbot can instantly answer questions about courses, fees,
              admissions, and the student portal — available 24/7.
            </p>
            <div className="bg-navy/5 border border-navy/10 rounded-lg p-3 text-xs space-y-1">
              <div className="font-bold text-navy">Common questions:</div>
              {["What STCW courses do you offer?", "How do I apply for BST?", "What documents do I need?"].map((q) => (
                <div key={q} className="text-ocean">· {q}</div>
              ))}
            </div>
            <p className="text-muted text-xs mt-3">
              👉 Use the chat widget in the bottom-right corner
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
