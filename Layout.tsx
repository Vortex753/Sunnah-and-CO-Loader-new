import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home, Info, Mail, ShoppingBag, ShoppingCart, Package, User, LogIn, LogOut, Menu, X, ChevronDown, PanelLeftClose, PanelLeft,
} from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import logoLight from "@/assets/logo-light.png";
import { categories, nav as navTree } from "@/lib/data";
import { useStore } from "@/lib/store";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Splash } from "@/components/Splash";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About Us", icon: Info },
] as const;

function SidebarContent({ collapsed, onNav, prodOpen, setProdOpen, flash }: { collapsed: boolean; onNav?: () => void; prodOpen: boolean; setProdOpen: (v: boolean) => void; flash?: boolean }) {
  const { user, cart, signOut } = useStore();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [, setOpenPage] = useState<string | null>(null);
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const item = "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors";
  const active = { className: "bg-sidebar-accent !text-gold font-medium" };

  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map((l) => (
        <Link key={l.to} to={l.to} onClick={onNav} className={item} activeProps={active} activeOptions={{ exact: true }} title={l.label}>
          <l.icon className="h-4 w-4 shrink-0" />
          {!collapsed && l.label}
        </Link>
      ))}
      <button onClick={() => setProdOpen(!prodOpen)} className={cn(item, "ring-1 ring-transparent transition-shadow duration-500", flash && "bg-sidebar-accent ring-gold")} title="Products">
        <ShoppingBag className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">Products</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", prodOpen && "rotate-180")} />
          </>
        )}
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-300 ease-in-out", !collapsed && prodOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
       <div className="overflow-hidden" inert={collapsed || !prodOpen}>
        <div className="ml-4 border-l border-sidebar-border pl-2">
          {navTree.map((n) => {
            const g = n.name;
            const open = openGroup === g;
            return (
              <div key={g}>
                <button onClick={() => { setOpenGroup(open ? null : g); setOpenPage(null); }} className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground">
                  {g}
                  <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-in-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden" inert={!open}>
                {n.pages && n.pages.map((pg) => (
                  <Link key={pg.group} to="/products" search={{ group: pg.group }} onClick={onNav} className="block rounded px-3 py-1.5 text-xs text-sidebar-foreground/80 hover:text-gold">{pg.label}</Link>
                ))}
                {!n.pages && (
                  <Link to="/products" search={{ group: g }} onClick={onNav} className="block rounded px-3 py-1 text-xs font-medium text-gold hover:underline">All {g} →</Link>
                )}
                {!n.pages && categories.filter((c) => c.group === g).map((c) => (
                  <Link key={c.slug} to="/products" search={{ category: c.slug }} onClick={onNav} className="block rounded px-3 py-1 text-xs text-sidebar-foreground/70 hover:text-gold">{c.name}</Link>
                ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
       </div>
      </div>
      <Link to="/cart" onClick={onNav} className={item} activeProps={active} title="My Cart">
        <ShoppingCart className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="flex-1">My Cart</span>}
        {!collapsed && count > 0 && <span className="rounded-full bg-gold px-2 text-xs text-gold-foreground">{count}</span>}
      </Link>
      <Link to="/contact" onClick={onNav} className={item} activeProps={active} activeOptions={{ exact: true }} title="Get in Touch">
        <Mail className="h-4 w-4 shrink-0" />
        {!collapsed && "Get in Touch"}
      </Link>
      {user ? (
        <>
          <Link to="/orders" onClick={onNav} className={item} activeProps={active} title="My Orders">
            <Package className="h-4 w-4 shrink-0" />
            {!collapsed && "My Orders"}
          </Link>
          <Link to="/account" onClick={onNav} className={item} activeProps={active} title="My Account">
            <User className="h-4 w-4 shrink-0" />
            {!collapsed && "My Account"}
          </Link>
          <button onClick={() => { signOut(); onNav?.(); }} className={item} title="Sign out">
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </>
      ) : (
        <Link to="/signin" onClick={onNav} className={item} activeProps={active} title="Sign In / Up">
          <LogIn className="h-4 w-4 shrink-0" />
          {!collapsed && "Sign In / Up"}
        </Link>
      )}
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, cart, signOut } = useStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [prodOpen, setProdOpen] = useState(true);
  const [flash, setFlash] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 4);
    check();
    const t = setTimeout(check, 150);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { clearTimeout(t); window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [pathname]);
  const [mobile, setMobile] = useState(false);
  const count = cart.reduce((a, c) => a + c.qty, 0);
  const nav = cn("text-sm transition-colors", scrolled ? "text-white/85 hover:text-white" : "text-foreground/75 hover:text-primary");
  const navActive = { className: scrolled ? "!text-gold font-medium" : "!text-primary font-medium" };

  return (
    <div className="print-bg flex min-h-screen w-full bg-background">
      <Splash />
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 overflow-y-auto overflow-x-hidden whitespace-nowrap bg-sidebar transition-[width] duration-300 ease-in-out lg:block", collapsed ? "w-16" : "w-64")}>
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && <span className="font-display text-lg tracking-widest text-gold">SUNNAH &amp; CO.</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground/70 hover:text-gold" aria-label="Toggle sidebar">
            {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>
        <SidebarContent collapsed={collapsed} prodOpen={prodOpen} setProdOpen={setProdOpen} flash={flash} />
      </aside>

      <div className={cn("fixed inset-0 z-50 lg:hidden", mobile ? "" : "pointer-events-none")} aria-hidden={!mobile}>
        <div className={cn("absolute inset-0 bg-foreground/50 transition-opacity duration-300 ease-in-out", mobile ? "opacity-100" : "opacity-0")} onClick={() => setMobile(false)} />
        <aside className={cn("absolute left-0 top-0 h-full w-72 overflow-y-auto bg-sidebar shadow-xl transition-transform duration-300 ease-in-out", mobile ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <span className="font-display tracking-widest text-gold">SUNNAH &amp; CO.</span>
            <button onClick={() => setMobile(false)} className="text-sidebar-foreground" aria-label="Close"><X className="h-5 w-5" /></button>
          </div>
          <SidebarContent collapsed={false} onNav={() => setMobile(false)} prodOpen={prodOpen} setProdOpen={setProdOpen} flash={flash} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={cn(
          "sticky top-0 z-40 flex h-16 items-center gap-6 border-b px-4 transition-[background-color,box-shadow,border-color] duration-500 md:px-8",
          scrolled
            ? "border-gold/30 bg-[oklch(0.24_0.06_157)] text-white shadow-lg shadow-black/25"
            : "border-border bg-white text-foreground",
        )}>
          <button className="lg:hidden" onClick={() => setMobile(true)} aria-label="Menu"><Menu className="h-5 w-5" /></button>
          <Link to="/" className="shrink-0"><span className="relative block h-11 w-[7.8rem]">
            <img src={logo.url} alt="Sunnah & Co." className={cn("absolute inset-0 h-11 w-auto mix-blend-multiply transition-opacity duration-500", scrolled ? "opacity-0" : "opacity-100")} />
            <img src={logoLight} alt="" aria-hidden="true" className={cn("absolute inset-0 h-11 w-auto transition-opacity duration-500", scrolled ? "opacity-100" : "opacity-0")} />
          </span></Link>
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {links.filter((l) => l.to !== "/").map((l) => (
              <Link key={l.to} to={l.to} className={nav} activeProps={navActive} activeOptions={{ exact: true }}>{l.label}</Link>
            ))}
            <button
              className={cn(nav, "flex items-center gap-1")}
              onClick={() => {
                setProdOpen(true);
                setFlash(true);
                setTimeout(() => setFlash(false), 1400);
                if (window.matchMedia("(min-width: 1024px)").matches) setCollapsed(false);
                else setMobile(true);
              }}
            >
              Products <ChevronDown className="h-3 w-3 -rotate-90" />
            </button>
            <Link to="/contact" className={nav} activeProps={navActive} activeOptions={{ exact: true }}>Get in Touch</Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/cart" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && <span className={cn("absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]", scrolled ? "bg-gold text-gold-foreground" : "bg-primary text-primary-foreground")}>{count}</span>}
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm outline-none", scrolled && "border-white/40")}>
                  <User className="h-4 w-4" /> <span className="hidden sm:inline">{user.firstName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>My Account</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/orders" })}>My Orders</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { signOut(); navigate({ to: "/" }); }}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/signin" className={cn("rounded-full px-4 py-1.5 text-sm transition-colors", scrolled ? "bg-gold text-gold-foreground hover:bg-gold/90" : "bg-primary text-primary-foreground hover:bg-primary/90")}>Sign In</Link>
            )}
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-4 border-gold bg-foreground px-8 pb-6 pt-14 text-background">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <p className="font-display text-2xl tracking-widest text-gold">SUNNAH &amp; CO.</p>
              <p className="mt-3 text-sm text-background/70">Authentic Islamic books, clothing and Sunnah essentials for the whole family, sourced with care and delivered with honesty.</p>
              <p className="mt-4 text-sm italic text-gold/90">Bringing the Sunnah into everyday life.</p>
            </div>
            <div className="text-sm text-background/70">
              <p className="mb-3 font-medium uppercase tracking-wider text-background">Shop</p>
              <Link to="/products" search={{ group: "Islamic Books" }} className="block py-1 hover:text-gold">Islamic Books</Link>
              <Link to="/products" search={{ group: "E-Books" }} className="block py-1 hover:text-gold">E-Books</Link>
              <Link to="/products" search={{ group: "Thobes/Islamic Wear" }} className="block py-1 hover:text-gold">Men's Islamic Wear</Link>
              <Link to="/products" search={{ group: "Prayer Dress/Islamic Wear" }} className="block py-1 hover:text-gold">Women's Islamic Wear</Link>
              <Link to="/products" search={{ group: "Kids Thobes/Islamic Wear" }} className="block py-1 hover:text-gold">Kids</Link>
              <Link to="/products" search={{ group: "General Accessories" }} className="block py-1 hover:text-gold">Accessories</Link>
            </div>
            <div className="text-sm text-background/70">
              <p className="mb-3 font-medium uppercase tracking-wider text-background">Company</p>
              <Link to="/about" className="block py-1 hover:text-gold">About Us</Link>
              <Link to="/contact" className="block py-1 hover:text-gold">Get in Touch</Link>
              <Link to="/cart" className="block py-1 hover:text-gold">My Cart</Link>
              <Link to="/orders" className="block py-1 hover:text-gold">Track My Order</Link>
              <Link to="/signin" className="block py-1 hover:text-gold">Sign In / Up</Link>
            </div>
            <div className="text-sm text-background/70">
              <p className="mb-3 font-medium uppercase tracking-wider text-background">Contact</p>
              <p className="py-1">hello@sunnahandco.com</p>
              <p className="py-1">+1 (555) 012-3456</p>
              <p className="py-1">123 Market Street, Your City</p>
              <p className="py-1">Mon – Sat, 10:00 – 18:00</p>
            </div>
          </div>
          <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-background/15 pt-6 text-xs text-background/50 md:flex-row md:justify-between">
            <p>© {new Date().getFullYear()} Sunnah &amp; Co. All rights reserved.</p>
            <p>Secure checkout · Tracked delivery · Authentic products · build 1-Oct-B</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
