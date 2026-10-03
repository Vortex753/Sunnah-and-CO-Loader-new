import { createFileRoute, Link } from "@tanstack/react-router";
import { money, ORDER_STAGES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "My Orders — Sunnah & Co." },
      { name: "description", content: "Track your Sunnah & Co. orders." },
      { property: "og:title", content: "My Orders — Sunnah & Co." },
      { property: "og:description", content: "Track your orders." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { user, orders } = useStore();
  if (!user) return <div className="py-24 text-center"><Link to="/signin" className="text-primary">Sign in</Link> to view your orders.</div>;
  const mine = orders.filter((o) => o.userId === user.id);
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-5xl">My Orders</h1>
      {mine.length === 0 && <p className="mt-6 text-muted-foreground">No orders yet. <Link to="/" className="text-primary">Start shopping</Link></p>}
      <div className="mt-8 space-y-3">
        {mine.map((o) => (
          <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="flex items-center justify-between rounded-lg border bg-card p-4 hover:border-primary">
            <div>
              <p className="font-medium">Order #{o.id}</p>
              <p className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()} · {o.items.length} item(s)</p>
            </div>
            <div className="text-right">
              <span className={`rounded-full px-3 py-1 text-xs ${o.stage === 4 ? "bg-primary text-primary-foreground" : "bg-accent"}`}>{ORDER_STAGES[o.stage]}</span>
              <p className="mt-1 text-sm font-medium">{money(o.total)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
