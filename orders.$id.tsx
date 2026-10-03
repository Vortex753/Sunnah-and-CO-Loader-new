import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Store, Warehouse, Truck, PackageCheck, ClipboardList, Star } from "lucide-react";
import { toast } from "sonner";
import { getProduct, money, ORDER_STAGES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order #${params.id} — Sunnah & Co.` },
      { name: "description", content: "Track the delivery status of your order." },
      { property: "og:title", content: "Order tracking — Sunnah & Co." },
      { property: "og:description", content: "Track the delivery status of your order." },
    ],
  }),
  component: OrderPage,
});

const icons = [ClipboardList, Store, Warehouse, Truck, PackageCheck];

function ReviewForm({ orderId, productId }: { orderId: string; productId: string }) {
  const { user, addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const p = getProduct(productId)!;
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="font-medium">{p.name}</p>
      <div className="mt-2 flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} stars`}>
            <Star className={`h-6 w-6 ${i <= rating ? "fill-gold text-gold" : "text-border"}`} />
          </button>
        ))}
      </div>
      <Textarea className="mt-2" maxLength={500} placeholder="Share your experience…" value={text} onChange={(e) => setText(e.target.value)} />
      <Button
        size="sm"
        className="mt-2"
        onClick={() => {
          if (!text.trim()) { toast.error("Please write a short review."); return; }
          addReview(orderId, { productId, rating, text: text.trim(), name: `${user!.firstName} ${user!.lastName[0]}.` });
          toast.success("Thank you! Your review is now on the product page.");
        }}
      >
        Submit review
      </Button>
    </div>
  );
}

function OrderPage() {
  const { id } = Route.useParams();
  const { user, orders, advanceOrder } = useStore();
  const o = orders.find((x) => x.id === id && x.userId === user?.id);
  if (!user) return <div className="py-24 text-center"><Link to="/signin" className="text-primary">Sign in</Link> to view this order.</div>;
  if (!o) return <div className="py-24 text-center">Order not found. <Link to="/orders" className="text-primary">My orders</Link></div>;
  const delivered = o.stage === ORDER_STAGES.length - 1;
  const toReview = o.items.filter((i) => !o.reviewed.includes(i.productId));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Order tracking</p>
      <h1 className="font-display text-5xl">Order #{o.id}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Placed {new Date(o.createdAt).toLocaleString()} · Delivering to {o.address}</p>

      <div className="mt-10 rounded-lg border bg-card p-6">
        <div className="relative flex justify-between">
          <div className="absolute left-6 right-6 top-6 h-1 bg-border" />
          <div className="absolute left-6 top-6 h-1 bg-primary transition-all duration-700" style={{ width: `calc((100% - 3rem) * ${o.stage / (ORDER_STAGES.length - 1)})` }} />
          {ORDER_STAGES.map((s, i) => {
            const I = icons[i]!;
            const done = i <= o.stage;
            return (
              <div key={s} className="relative z-10 flex w-20 flex-col items-center text-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"} ${i === o.stage && !delivered ? "ring-4 ring-gold/40" : ""}`}>
                  {done && i < o.stage ? <Check className="h-5 w-5" /> : <I className="h-5 w-5" />}
                </div>
                <p className={`mt-2 text-xs ${done ? "font-medium" : "text-muted-foreground"}`}>{s}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <p className="text-sm">Current status: <span className="font-semibold text-primary">{ORDER_STAGES[o.stage]}</span></p>
          {!delivered && <Button variant="outline" size="sm" onClick={() => advanceOrder(o.id)}>Advance status (demo)</Button>}
        </div>
        {!delivered && <p className="mt-2 text-xs text-muted-foreground">For this prototype, status moves forward automatically every 20 seconds.</p>}
      </div>

      {delivered && (
        <section className="mt-8">
          <h2 className="font-display text-3xl">How was your order?</h2>
          {toReview.length ? (
            <div className="mt-4 space-y-3">{toReview.map((i) => <ReviewForm key={i.productId} orderId={o.id} productId={i.productId} />)}</div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Thank you for reviewing all items in this order!</p>
          )}
        </section>
      )}

      <section className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="font-display text-2xl">Items</h2>
        <div className="mt-3 space-y-2 text-sm">
          {o.items.map((i) => {
            const p = getProduct(i.productId)!;
            return <div key={i.productId} className="flex justify-between"><Link to="/products/$id" params={{ id: p.id }} className="hover:text-primary">{p.name} × {i.qty}</Link><span className="flex items-center gap-3">{p.format === "ebook" && <button className="rounded border border-gold px-2 py-0.5 text-xs text-gold hover:bg-accent" onClick={() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([`${p.name}\n\nSample e-book file (prototype).`], { type: "text/plain" })); a.download = `${p.name}.txt`; a.click(); }}>Download</button>}{money(i.price * i.qty)}</span></div>;
          })}
          <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{money(o.total)}</span></div>
        </div>
      </section>
    </div>
  );
}
