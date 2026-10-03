import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, Star, Leaf, BookOpen, Lock, PackageCheck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import quran from "@/assets/about-quran.jpg";
import abaya from "@/assets/about-abaya.jpg";
import thobe from "@/assets/about-thobe.jpg";
import catMiswak from "@/assets/cat-miswak.jpg";
import catAttar from "@/assets/cat-attar.jpg";
import catQuranGold from "@/assets/cat-quran-gold.jpg";
import catTasbih from "@/assets/cat-tasbih.jpg";
import catSurma from "@/assets/cat-surma.jpg";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunnah & Co. — Authentic Islamic Essentials" },
      { name: "description", content: "Islamic books, jubba, thobe, abaya, miswak, surma, mehendi, attar and more for men, women and kids." },
      { property: "og:title", content: "Sunnah & Co. — Authentic Islamic Essentials" },
      { property: "og:description", content: "Shop Islamic essentials for men, women and kids, delivered with care." },
    ],
  }),
  component: Index,
});

const featured = ["thobes-islamic-wear-thobe", "prayer-dress-islamic-wear-abaya", "men-s-accessories-miswak-brush", "men-s-accessories-atar", "islamic-books-qur-an-and-tafsir", "e-books-qur-an-and-tafsir", "general-accessories-tabeeh", "women-s-accessories-perfumes-atar-for-females"];
const tileImg: Record<string, string> = {
  "thobes-islamic-wear-thobe": thobe,
  "prayer-dress-islamic-wear-abaya": abaya,
  "men-s-accessories-miswak-brush": catMiswak,
  "men-s-accessories-atar": catAttar,
  "islamic-books-qur-an-and-tafsir": quran,
  "e-books-qur-an-and-tafsir": catQuranGold,
  "general-accessories-tabeeh": catTasbih,
  "women-s-accessories-perfumes-atar-for-females": catSurma,
};

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden" data-hero>
        <img src={hero} alt="Islamic essentials flat-lay" width={1600} height={912} className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 md:px-16">
          <div className="max-w-xl text-background">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Live the Sunnah</p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">Authentic Islamic essentials, curated with care</h1>
            <p className="mt-4 text-background/80">From the Mushaf to miswak — a wide range of books, clothing, grooming and gifts.</p>
            <div className="mt-8 flex gap-3">
              <Button asChild size="lg" className="border border-gold/50 bg-[oklch(0.24_0.06_157)] text-gold shadow-lg shadow-black/30 hover:bg-[oklch(0.3_0.07_157)] hover:text-gold"><a href="#shop" onClick={(e) => { e.preventDefault(); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Shop now</a></Button>
              <Button asChild size="lg" variant="outline" className="border-gold bg-transparent text-gold hover:bg-gold/10 hover:text-gold"><Link to="/about">Our story</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 border-b px-6 py-8 md:grid-cols-4 md:px-12">
        {[[Truck, "Tracked delivery"], [ShieldCheck, "Secure checkout"], [Star, "Verified reviews"], [Leaf, "Authentic sourcing"]].map(([I, t]: any) => (
          <div key={t} className="flex items-center gap-3 text-sm"><I className="h-5 w-5 text-primary" />{t}</div>
        ))}
      </section>

      <section id="shop" className="scroll-mt-20 px-6 py-14 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-4xl">Shop by category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.filter((s) => categories.some((x) => x.slug === s)).map((s) => {
            const c = categories.find((x) => x.slug === s)!;
            return (
              <Link key={s} to="/products" search={{ category: s }} className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-foreground p-4">
                <img src={tileImg[s]} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/50 to-foreground/5" />
                <div className="relative">
                  <p className="font-display text-2xl text-background group-hover:text-gold">{c.name}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary px-6 py-14 md:px-12">
        <h2 className="mb-8 font-display text-4xl">Bestsellers</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {products.filter((_, i) => i % 25 === 0).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="px-6 py-14 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Why Sunnah &amp; Co.</p>
          <h2 className="mt-2 font-display text-4xl">A store you can trust</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Leaf, "Authentic sourcing", "We work with reputable publishers, tailors and makers across the Muslim world."],
              [PackageCheck, "Checked with care", "Every order is inspected and packed at our store before it is dispatched."],
              [Truck, "Tracked delivery", "Follow your order through every stage, from our store to your door."],
              [Lock, "Secure checkout", "A simple, protected checkout, with your delivery details saved for next time."],
            ].map(([I, t, d]: any) => (
              <div key={t} className="rounded-lg border-t-4 border-gold bg-card p-6 shadow-sm">
                <I className="h-6 w-6 text-gold" />
                <h3 className="mt-3 font-display text-2xl text-primary">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 md:grid-cols-2 md:px-12">
        {[
          { img: quran, k: "Knowledge", t: "Books and e-books for every reader", d: "Qur'an and Tafsir, rulings of the Shariyah and the works of trusted scholars, plus stories for children.", to: "Islamic Books", cta: "Browse books" },
          { img: abaya, k: "Modesty", t: "Clothing made for dignity and comfort", d: "Thobes and jubbahs for men, abayas and prayer dresses for women, and Islamic wear for kids.", to: "Prayer Dress/Islamic Wear", cta: "Shop Islamic wear" },
        ].map((c) => (
          <Link key={c.t} to="/products" search={{ group: c.to }} className="group relative block overflow-hidden rounded-lg">
            <img src={c.img} alt={c.t} loading="lazy" className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
            <div className="absolute bottom-0 p-6 text-background">
              <p className="text-xs uppercase tracking-[0.3em] text-gold">{c.k}</p>
              <h3 className="mt-1 font-display text-3xl">{c.t}</h3>
              <p className="mt-2 max-w-md text-sm text-background/80">{c.d}</p>
              <span className="mt-3 inline-block text-sm text-gold">{c.cta} →</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-foreground px-6 py-16 text-center text-background md:px-12">
        <BookOpen className="mx-auto h-8 w-8 text-gold" />
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl">Begin today, and bring more of the Sunnah into your home</h2>
        <p className="mx-auto mt-3 max-w-xl text-background/70">Create an account to save your delivery address, track your orders and download your e-books.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90"><a href="#shop" onClick={(e) => { e.preventDefault(); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Start shopping</a></Button>
          <Button asChild size="lg" variant="outline" className="border-background/50 bg-transparent text-background hover:bg-background/10 hover:text-background"><Link to="/signup">Create account</Link></Button>
        </div>
      </section>
    </div>
  );
}
