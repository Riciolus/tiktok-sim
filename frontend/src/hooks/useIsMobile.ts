// useIsMobile.ts
import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 768px)";

export function useIsMobile(): boolean {
  // ✅ On the server we DON'T try to guess
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);

    const update = () => setIsMobile(mql.matches);
    update(); // check on mount

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
    } else {
      mql.addListener(update);
    }

    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", update);
      } else {
        mql.removeListener(update);
      }
    };
  }, []);

  return isMobile;
}
