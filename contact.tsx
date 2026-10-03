import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import banner from "@/assets/about-banner.jpg";
import thobe from "@/assets/about-thobe.jpg";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get in Touch — Sunnah & Co." },
      { name: "description", content: "Contact Sunnah & Co. for orders, questions, or wholesale enquiries." },
      { property: "og:title", content: "Get in Touch — Sunnah & Co." },
      { property: "og:description", content: "Contact Sunnah & Co. — we're happy to help." },
    ],
  }),
  component: Contact,
});

const faqs: [string, string][] = [
  ["Do I need an account to shop?", "You can browse freely as a guest. To add items to your cart and check out, please sign in or create an account. It only takes a minute."],
  ["How do I track my order?", "Open My Orders after signing in. Each order moves through five stages: Order Placed, In Store, At Warehouse, Out for Delivery and Delivered."],
  ["How do I get my e-book?", "E-books are digital. Once you have placed your order, open it in My Orders and use the Download button next to the book."],
  ["Can I save more than one delivery address?", "Yes, you can save up to two addresses in My Account. The first is your default, and you can change or add a one-time address at checkout."],
  ["Do you take bulk or wholesale enquiries?", "Yes. Send us a message with what you need and the quantities, and we will get back to you."],
];

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const info = [
    { i: Mail, t: "Email us", d: "hello@sunnahandco.com" },
    { i: Phone, t: "Call us", d: "+1 (555) 012-3456" },
    { i: MapPin, t: "Visit us", d: "123 Market Street, Your City" },
    { i: Clock, t: "Opening hours", d: "Mon – Sat, 10:00 – 18:00" },
  ];
  return (
    <div>
      <section className="relative" data-hero>
        <img src={banner} alt="Islamic essentials" className="h-[300px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/65 to-foreground/20" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div className="max-w-2xl text-background">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Contact us</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">We'd love to hear from you</h1>
            <p className="mt-3 text-background/80">Questions about an order or a product? We reply within one business day, in sha Allah.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {info.map(({ i: I, t, d }) => (
            <div key={t} className="rounded-lg border-t-4 border-gold bg-card p-6 shadow-sm">
              <I className="h-6 w-6 text-gold" />
              <h3 className="mt-3 font-display text-2xl text-primary">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Send a message</p>
            <h2 className="mt-2 font-display text-4xl">How can we help?</h2>
            <p className="mt-4 text-muted-foreground">Whether it is an order, a product question, a request for something you cannot find, or a bulk enquiry, send us a few lines and the right person will get back to you.</p>
            <img src={thobe} alt="Folded white thobe" loading="lazy" className="mt-6 hidden h-60 w-full rounded-lg object-cover shadow-md md:block" />
          </div>
          <form
            className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.message.trim()) { toast.error("Please fill in all fields correctly."); return; }
              toast.success("JazakAllahu khayran! We'll be in touch soon.");
              setF({ name: "", email: "", message: "" });
            }}
          >
            <div><Label>Name</Label><Input maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" maxLength={255} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div><Label>Message</Label><Textarea rows={7} maxLength={1000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></div>
            <Button type="submit" size="lg" className="w-full">Send message</Button>
          </form>
        </div>
      </section>

      <section className="bg-secondary px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Quick answers</p>
          <h2 className="mt-2 font-display text-4xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([q, a], idx) => {
              const open = openFaq === idx;
              return (
                <div key={q} className={`overflow-hidden rounded-lg border bg-card shadow-sm transition-colors ${open ? "border-gold" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium hover:bg-accent/40"
                  >
                    {q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden" inert={!open}>
                      <p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-foreground px-6 py-14 text-center text-background">
        <h2 className="mx-auto max-w-2xl font-display text-4xl">Ready to find what you need?</h2>
        <p className="mx-auto mt-3 max-w-xl text-background/70">Browse our books, clothing and Sunnah essentials for the whole family.</p>
        <Button asChild size="lg" className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/">Shop now</Link></Button>
      </section>
    </div>
  );
}
