import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { getProduct, money } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Sunnah & Co." },
      { name: "description", content: "Complete your Sunnah & Co. order securely." },
      { property: "og:title", content: "Checkout — Sunnah & Co." },
      { property: "og:description", content: "Complete your order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { user, cart, placeOrder } = useStore();
  const navigate = useNavigate();
  const [choice, setChoice] = useState("0");
  const [custom, setCustom] = useState("");
  const [card, setCard] = useState({ name: "", number: "", exp: "", cvc: "" });
  const [paying, setPaying] = useState(false);

  if (!user) return <div className="py-24 text-center"><Link to="/signin" className="text-primary">Sign in</Link> to check out.</div>;
  const items = cart.map((c) => ({ ...c, p: getProduct(c.productId)! })).filter((c) => c.p);
  if (!items.length) return <div className="py-24 text-center">Your cart is empty. <Link to="/" className="text-primary">Shop now</Link></div>;
  const subtotal = items.reduce((a, c) => a + c.p.price * c.qty, 0);
  const shipping = subtotal > 75 ? 0 : 6.99;
  const total = subtotal + shipping;

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    const address = choice === "custom" ? custom.trim() : user.addresses[Number(choice)] ?? user.addresses[0];
    if (!address) { toast.error("Please enter a delivery address."); return; }
    if (!card.name.trim() || card.number.replace(/\s/g, "").length < 12 || !card.exp || card.cvc.length < 3) { toast.error("Please complete your payment details."); return; }
    setPaying(true);
    setTimeout(() => {
      const id = placeOrder({ items: items.map((c) => ({ productId: c.p.id, qty: c.qty, price: c.p.price })), total, address });
      toast.success("Payment successful! Order placed.");
      navigate({ to: "/orders/$id", params: { id } });
    }, 1200);
  };

  return (
    <form onSubmit={pay} className="mx-auto grid max-w-5xl gap-8 px-6 py-10 md:grid-cols-3">
      <div className="space-y-8 md:col-span-2">
        <h1 className="font-display text-5xl">Checkout</h1>
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-display text-2xl">Delivery address</h2>
          <RadioGroup value={choice} onValueChange={setChoice} className="mt-4 space-y-2">
            {user.addresses.map((a, i) => (
              <label key={i} className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${choice === String(i) ? "border-primary bg-secondary" : ""}`}>
                <RadioGroupItem value={String(i)} className="mt-1" />
                <div><p className="text-sm font-medium">Deliver at Address {i + 1}{i === 0 && " (default)"}</p><p className="text-sm text-muted-foreground">{a}</p></div>
              </label>
            ))}
            <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${choice === "custom" ? "border-primary bg-secondary" : ""}`}>
              <RadioGroupItem value="custom" className="mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">Use a different address for this order</p>
                {choice === "custom" && <Textarea className="mt-2" maxLength={300} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Full delivery address" />}
              </div>
            </label>
          </RadioGroup>
          {user.addresses.length < 2 && <p className="mt-3 text-xs text-muted-foreground">You can save a second address in <Link to="/account" className="text-primary">My Account</Link>.</p>}
        </section>
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-display text-2xl">Payment</h2>
          <p className="text-xs text-muted-foreground">Demo only — no real payment is taken.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Name on card</Label><Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Card number</Label><Input inputMode="numeric" maxLength={19} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
            <div><Label>Expiry</Label><Input placeholder="MM/YY" maxLength={5} value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} /></div>
            <div><Label>CVC</Label><Input maxLength={4} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} /></div>
          </div>
        </section>
      </div>
      <aside className="h-fit rounded-lg border-t-4 border-gold bg-card p-6 shadow-sm md:mt-20">
        <h2 className="font-display text-2xl">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          {items.map(({ p, qty }) => <div key={p.id} className="flex justify-between gap-2"><span>{p.name} × {qty}</span><span>{money(p.price * qty)}</span></div>)}
          <div className="flex justify-between border-t pt-2"><span>Shipping</span><span>{shipping ? money(shipping) : "Free"}</span></div>
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{money(total)}</span></div>
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={paying}>{paying ? "Processing…" : `Pay ${money(total)}`}</Button>
      </aside>
    </form>
  );
}
