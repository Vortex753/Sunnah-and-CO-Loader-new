import { Link, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { getCategory, money, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  const cat = getCategory(product.category);
  return (
    <div className={`relative flex aspect-square items-center justify-center overflow-hidden bg-secondary pattern-bg ${className}`}>
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold/60 bg-background font-display text-3xl text-primary shadow-sm">
        {product.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
      </div>
      {product.format === "ebook" && <span className="absolute right-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold-foreground">E-Book</span>}
      <span className="absolute bottom-2 left-2 rounded bg-foreground/85 px-2 py-0.5 text-[10px] uppercase tracking-wider text-background">{cat?.name}</span>
    </div>
  );
}

export function useAddToCart() {
  const { user, addToCart } = useStore();
  const navigate = useNavigate();
  return (p: Product, qty = 1) => {
    if (!user) {
      toast("Please sign in to add items to your cart");
      navigate({ to: "/signin" });
      return;
    }
    addToCart(p.id, qty);
    toast.success(`${p.name} added to cart`);
  };
}

export function ProductCard({ product }: { product: Product }) {
  const add = useAddToCart();
  const [about, setAbout] = useState(false);
  const { reviews } = useStore();
  const rs = reviews.filter((r) => r.productId === product.id);
  const avg = rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : 0;
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      <Link to="/products/$id" params={{ id: product.id }}><ProductArt product={product} /></Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to="/products/$id" params={{ id: product.id }} className="font-medium leading-tight hover:text-primary">{product.name}</Link>
        {rs.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Star className="h-3 w-3 fill-gold text-gold" /> {avg.toFixed(1)} ({rs.length})</div>
        )}
        {product.format === "ebook" ? (
          <div className="mt-auto pt-2">
            <span className="font-semibold">{money(product.price)}</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => add(product)}>Add To Cart</Button>
              <Button size="sm" variant="outline" onClick={() => setAbout(true)}>About the book</Button>
            </div>
            {about && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`About ${product.name}`}>
                <div className="absolute inset-0 bg-foreground/60" onClick={() => setAbout(false)} />
                <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-xl">
                  <button className="absolute right-3 top-3 text-muted-foreground hover:text-foreground" onClick={() => setAbout(false)} aria-label="Close">✕</button>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">About the book</p>
                  <h3 className="mt-1 pr-6 font-display text-2xl">{product.name}</h3>
                  <p className="mt-3 text-sm text-foreground/80">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-semibold">{money(product.price)}</span>
                    <Button size="sm" onClick={() => { add(product); setAbout(false); }}>Add To Cart</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="font-semibold">{money(product.price)}</span>
            <Button size="sm" onClick={() => add(product)}>Add to cart</Button>
          </div>
        )}
      </div>
    </div>
  );
}
