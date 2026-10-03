import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { getCategory, getProduct, money, products } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt, ProductCard, useAddToCart } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.product.name} — Sunnah & Co.`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.product.description }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.product.description }] };
  },
  notFoundComponent: () => <div className="p-20 text-center">Product not found. <Link to="/" className="text-primary">Back to shop</Link></div>,
  errorComponent: () => <div className="p-20 text-center">Something went wrong.</div>,
  component: ProductPage,
});

function Stars({ n }: { n: number }) {
  return <div className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={`h-4 w-4 ${i <= Math.round(n) ? "fill-gold text-gold" : "text-border"}`} />)}</div>;
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { reviews } = useStore();
  const add = useAddToCart();
  const [qty, setQty] = useState(1);
  const cat = getCategory(product.category)!;
  const rs = reviews.filter((r) => r.productId === product.id);
  const avg = rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : 0;

  return (
    <div className="px-6 py-10 md:px-10">
      <div className="mb-6 text-sm text-muted-foreground">
        <Link to="/products" search={{ category: cat.slug }} className="hover:text-primary">← {cat.name}</Link>
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductArt product={product} className="rounded-lg" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{cat.name}</p>
          <h1 className="mt-2 font-display text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Stars n={avg} /> {rs.length} review{rs.length !== 1 && "s"}</div>
          <p className="mt-6 text-3xl font-semibold text-primary">{money(product.price)}</p>
          <p className="mt-6 text-muted-foreground">{product.description}</p>
          {product.format === "ebook" && <p className="mt-2 text-sm text-gold">Digital download — available in My Orders right after purchase.</p>}
          <div className="mt-8 flex items-center gap-4">
            {product.format !== "ebook" && <div className="flex items-center rounded-md border">
              <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button className="p-3" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></button>
            </div>}
            <Button size="lg" onClick={() => add(product, product.format === "ebook" ? 1 : qty)}>{product.format === "ebook" ? "Add To Cart" : "Add to cart"}</Button>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl">Customer reviews</h2>
        {rs.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No reviews yet. Reviews are added by customers after their order is delivered.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {rs.map((r, i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between"><Stars n={r.rating} /><span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span></div>
                <p className="mt-2 text-sm">{r.text}</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">— {r.name} · Verified buyer</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="mb-6 font-display text-3xl">More from {cat.name}</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {products.filter((p) => p.category === product.category && p.id !== product.id).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
