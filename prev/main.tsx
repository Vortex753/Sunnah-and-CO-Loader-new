import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, RouterProvider, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";
import css from "../src/styles.css?inline";
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
const router = createRouter({ routeTree, context: { queryClient: new QueryClient() }, history: createHashHistory(), defaultPreloadStaleTime: 0 });
createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);

// Hand-off from the static boot loader (shown while the page downloads) to the app
(window as any).__bootLoader = !!document.getElementById("boot");
const boot = document.getElementById("boot");
if (boot) {
  let first = true;
  try { first = sessionStorage.getItem("sunnah-boot") !== "1"; sessionStorage.setItem("sunnah-boot", "1"); } catch { /* ignore */ }
  const minShow = first ? 2600 : 250;
  const wait = Math.max(0, minShow - performance.now());
  Promise.all([router.load().catch(() => {}), new Promise((r) => setTimeout(r, wait))]).then(() => {
    boot.classList.add("leave");
    boot.addEventListener("click", () => boot.remove());
    setTimeout(() => boot.remove(), 800);
  });
  boot.addEventListener("click", () => { boot.classList.add("leave"); setTimeout(() => boot.remove(), 750); });
}
