import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, categoryTypes, getCategory, nav, pageTitle, products, sectionedGroups } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";

type Search = { category?: string | undefined; group?: string | undefined; type?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s["category"] === "string" ? s["category"] : undefined,
    group: typeof s["group"] === "string" ? s["group"] : undefined,
    type: typeof s["type"] === "string" ? s["type"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (!search.group && !search.category && !search.type) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Shop Products — Sunnah & Co." },
      { name: "description", content: "Browse Islamic essentials for men, women and kids, plus Quran and Islamic books." },
      { property: "og:title", content: "Shop Products — Sunnah & Co." },
      { property: "og:description", content: "Browse Islamic products for men, women, kids and books." },
    ],
  }),
  component: Products,
});

function Products() {
  const { category, group, type } = Route.useSearch();
  const [q, setQ] = useState("");
  const cat = category ? getCategory(category) : undefined;
  const list = products.filter(
    (p) =>
      (!category || p.category === category || (!!cat && sectionedGroups.includes(cat.group) && p.category !== undefined && getCategory(p.category)?.group === cat.group)) &&
      (!type || p.type === type) &&
      (!group || getCategory(p.category)?.group === group) &&
      p.name.toLowerCase().includes(q.toLowerCase()),
  );
  const chip = "whitespace-nowrap rounded-full border px-3 py-1 text-xs";
  const activeGroup = group ?? cat?.group;
  const sectioned = !!activeGroup && sectionedGroups.includes(activeGroup);
  const parent = nav.find((n) => activeGroup && n.pages?.some((x) => x.group === activeGroup))?.name;
  const jump = (slug: string) => document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => {
    if (sectioned && category) { const t = setTimeout(() => jump(category), 80); return () => clearTimeout(t); }
    return undefined;
  }, [category, sectioned]);

  return (
    <div className="px-6 py-10 md:px-10">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">{parent ?? cat?.group ?? group ?? "All collections"}</p>
      <h1 className="font-display text-5xl">{sectioned ? pageTitle(activeGroup!) : cat?.name ?? group ?? "All products"}</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="md:max-w-xs" />
      </div>
      {sectioned && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Jump to:</span>
          {categories.filter((c) => c.group === activeGroup).map((c) => (
            <button key={c.slug} onClick={() => jump(c.slug)} className={`${chip} hover:border-gold hover:bg-accent`}>{c.name}</button>
          ))}
        </div>
      )}
      {!sectioned && (group || cat) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/products" search={{ group: group ?? cat?.group }} className={`${chip} ${!category ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold"}`}>All {group ?? cat?.group}</Link>
          {categories.filter((c) => c.group === (group ?? cat?.group)).map((c) => (
            <Link key={c.slug} to="/products" search={{ category: c.slug }} className={`${chip} ${category === c.slug ? "border-gold bg-accent" : "hover:border-gold"}`}>{c.name}</Link>
          ))}
        </div>
      )}
      {cat && categoryTypes(cat.slug).length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filter by type:</span>
          <Link to="/products" search={{ category: cat.slug }} className={`${chip} ${!type ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold"}`}>All</Link>
          {categoryTypes(cat.slug).map((t) => (
            <Link key={t} to="/products" search={{ category: cat.slug, type: t }} className={`${chip} ${type === t ? "border-primary bg-primary text-primary-foreground" : "hover:border-gold"}`}>{t}</Link>
          ))}
        </div>
      )}
      {sectioned ? (
        <div className="mt-10 space-y-14">
          {categories.filter((c) => c.group === activeGroup).map((c) => {
            const items = list.filter((p) => p.category === c.slug);
            if (items.length === 0) return null;
            return (
              <section key={c.slug} id={c.slug} className="scroll-mt-24">
                <div className="border-b pb-2"><h2 className="font-display text-3xl">{c.name}</h2></div>
                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : group && !cat ? (
        <div className="mt-10 space-y-14">
          {categories.filter((c) => c.group === group).map((c) => {
            const items = list.filter((p) => p.category === c.slug);
            if (items.length === 0) return null;
            return (
              <section key={c.slug} id={c.slug}>
                <div className="flex items-baseline justify-between border-b pb-2">
                  <h2 className="font-display text-3xl">{c.name}</h2>
                  <Link to="/products" search={{ category: c.slug }} className="text-xs uppercase tracking-[0.2em] text-gold hover:underline">Show only this</Link>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : cat && categoryTypes(cat.slug).length > 0 && !type ? (
        <div className="mt-10 space-y-12">
          {categoryTypes(cat.slug).map((t) => {
            const items = list.filter((p) => p.type === t);
            if (items.length === 0) return null;
            return (
              <section key={t}>
                <div className="flex items-baseline justify-between border-b pb-2">
                  <h2 className="font-display text-3xl">{t}</h2>
                  <Link to="/products" search={{ category: cat.slug, type: t }} className="text-xs uppercase tracking-[0.2em] text-gold hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      {list.length === 0 && <p className="py-20 text-center text-muted-foreground">No products found.</p>}
    </div>
  );
}
