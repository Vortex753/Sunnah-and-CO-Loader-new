import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ORDER_STAGES } from "./data";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  addresses: string[]; // max 2
};
export type CartItem = { productId: string; qty: number };
export type Order = {
  id: string;
  userId: string;
  items: { productId: string; qty: number; price: number }[];
  total: number;
  address: string;
  createdAt: number;
  stage: number;
  reviewed: string[];
};
export type Review = { productId: string; name: string; rating: number; text: string; date: number };

type State = {
  users: User[];
  sessionId: string | null;
  carts: Record<string, CartItem[]>;
  orders: Order[];
  reviews: Review[];
};

const KEY = "sunnah-co-state-v1";
const empty: State = { users: [], sessionId: null, carts: {}, orders: [], reviews: [] };

type Ctx = State & {
  user: User | null;
  cart: CartItem[];
  signUp: (u: Omit<User, "id">) => string | null;
  signIn: (id: string, pw: string) => string | null;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (o: Omit<Order, "id" | "userId" | "createdAt" | "stage" | "reviewed">) => string;
  advanceOrder: (id: string) => void;
  addReview: (orderId: string, r: Omit<Review, "date">) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(empty);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setS({ ...empty, ...JSON.parse(v) });
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(s));
  }, [s, loaded]);

  // Demo: orders auto-advance one stage every 20 seconds
  useEffect(() => {
    const t = setInterval(() => {
      setS((p) => {
        const now = Date.now();
        let changed = false;
        const orders = p.orders.map((o) => {
          const target = Math.min(ORDER_STAGES.length - 1, Math.floor((now - o.createdAt) / 20000));
          if (target > o.stage) {
            changed = true;
            return { ...o, stage: target };
          }
          return o;
        });
        return changed ? { ...p, orders } : p;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const user = s.users.find((u) => u.id === s.sessionId) ?? null;
  const cart = user ? (s.carts[user.id] ?? []) : [];
  const setCart = (items: CartItem[]) =>
    user && setS((p) => ({ ...p, carts: { ...p.carts, [user.id]: items } }));

  const value: Ctx = {
    ...s,
    user,
    cart,
    signUp: (u) => {
      const e = u.email.trim().toLowerCase();
      if (s.users.some((x) => x.email.toLowerCase() === e)) return "An account with this email already exists.";
      if (s.users.some((x) => x.username.toLowerCase() === u.username.toLowerCase())) return "Username is taken.";
      const id = crypto.randomUUID();
      setS((p) => ({ ...p, users: [...p.users, { ...u, email: e, id }], sessionId: id }));
      return null;
    },
    signIn: (idf, pw) => {
      const k = idf.trim().toLowerCase();
      const found = s.users.find((u) => (u.email === k || u.username.toLowerCase() === k) && u.password === pw);
      if (!found) return "Incorrect username/email or password.";
      setS((p) => ({ ...p, sessionId: found.id }));
      return null;
    },
    signOut: () => setS((p) => ({ ...p, sessionId: null })),
    updateUser: (patch) =>
      user && setS((p) => ({ ...p, users: p.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)) })),
    addToCart: (productId, qty = 1) => {
      const ex = cart.find((c) => c.productId === productId);
      setCart(ex ? cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c)) : [...cart, { productId, qty }]);
    },
    setQty: (productId, qty) =>
      setCart(qty <= 0 ? cart.filter((c) => c.productId !== productId) : cart.map((c) => (c.productId === productId ? { ...c, qty } : c))),
    clearCart: () => setCart([]),
    placeOrder: (o) => {
      const id = "SC" + Math.floor(100000 + Math.random() * 900000);
      setS((p) => ({
        ...p,
        orders: [{ ...o, id, userId: user!.id, createdAt: Date.now(), stage: 0, reviewed: [] }, ...p.orders],
        carts: { ...p.carts, [user!.id]: [] },
      }));
      return id;
    },
    advanceOrder: (id) =>
      setS((p) => ({
        ...p,
        orders: p.orders.map((o) =>
          o.id === id ? { ...o, stage: Math.min(ORDER_STAGES.length - 1, o.stage + 1), createdAt: o.createdAt - 20000 } : o,
        ),
      })),
    addReview: (orderId, r) =>
      setS((p) => ({
        ...p,
        reviews: [{ ...r, date: Date.now() }, ...p.reviews],
        orders: p.orders.map((o) => (o.id === orderId ? { ...o, reviewed: [...o.reviewed, r.productId] } : o)),
      })),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
