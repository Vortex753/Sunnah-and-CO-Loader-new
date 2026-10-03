import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { getProduct, money } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "My Cart — Sunnah & Co." },
      { name: "description", content: "Review items in your Sunnah & Co. cart." },
      { property: "og:title", content: "My Cart — Sunnah & Co." },
      { property: "og:description", content: "Review items in your cart." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { user, cart, setQty } = useStore();
  if (!user)
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingCart className="h-10 w-10 text-gold" />
        <h1 className="font-display text-4xl">Sign in to view your cart</h1>
        <Button asChild><Link to="/signin">Sign In / Up</Link></Button>
      </div>
    );
  const items = cart.map((c) => ({ ...c, p: getProduct(c.productId)! })).filter((c) => c.p);
  const subtotal = items.reduce((a, c) => a + c.p.price * c.qty, 0);
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 6.99;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-5xl">My Cart</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4"><Link to="/">Continue shopping</Link></Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            {items.map(({ p, qty }) => (
              <div key={p.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-secondary font-display text-xl text-primary">{p.name[0]}</div>
                <div className="flex-1">
                  <Link to="/products/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.name}</Link>
                  <p className="text-sm text-muted-foreground">{money(p.price)}</p>
                </div>
                <div className="flex items-center rounded-md border">
                  <button className="p-2" onClick={() => setQty(p.id, qty - 1)}><Minus className="h-3 w-3" /></button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button className="p-2" onClick={() => setQty(p.id, qty + 1)}><Plus className="h-3 w-3" /></button>
                </div>
                <p className="w-20 text-right font-medium">{money(p.price * qty)}</p>
                <button onClick={() => setQty(p.id, 0)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-lg border-t-4 border-gold bg-card p-6 shadow-sm">
            <h2 className="font-display text-2xl">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-semibold"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
            </div>
            <Button asChild className="mt-6 w-full" size="lg"><Link to="/checkout">Proceed to checkout</Link></Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Free shipping on orders over $75</p>
          </div>
        </div>
      )}
    </div>
  );
}
