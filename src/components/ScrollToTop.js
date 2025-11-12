// src/components/ScrollToTop.js
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Return a unique-array of elements (keep order)
 */
function uniqueEls(arr) {
  const set = new Set();
  const out = [];
  for (const v of arr) {
    if (!v || set.has(v)) continue;
    set.add(v);
    out.push(v);
  }
  return out;
}

function gatherCandidates(scrollRef) {
  const list = [];
  if (scrollRef && scrollRef.current) list.push(scrollRef.current);
  const page = document.querySelector(".page-wrapper");
  if (page) list.push(page);
  if (document.scrollingElement) list.push(document.scrollingElement);
  list.push(document.documentElement);
  list.push(document.body);

  // add any elements that have overflowY auto/scroll/overlay — these are possible scroll containers
  try {
    const els = Array.from(document.querySelectorAll("*"));
    for (const el of els) {
      const style = window.getComputedStyle(el);
      if (!style) continue;
      const y = style.overflowY;
      if (y === "auto" || y === "scroll" || y === "overlay") {
        list.push(el);
      }
    }
  } catch (e) {
    // ignore queryAll failures in weird environments
  }

  return uniqueEls(list);
}

export default function ScrollToTop({ scrollRef }) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      try {
        window.history.scrollRestoration = "manual";
      } catch (e) {}
    }

    // schedule on the next frame to allow layout to stabilize
    requestAnimationFrame(() => {
      const candidates = gatherCandidates(scrollRef);

      // Try each candidate. Some might not be actually scrollable but setting scrollTop is harmless.
      for (const el of candidates) {
        try {
          if (!el) continue;
          if (typeof el.scrollTo === "function") {
            // use instant jump (auto) to avoid smooth animation unless you want it
            el.scrollTo({ top: 0, left: 0, behavior: "auto" });
          } else {
            el.scrollTop = 0;
          }
        } catch (e) {
          // ignore per-element failures
        }
      }
    });
  }, [pathname, scrollRef]);

  return null;
}
