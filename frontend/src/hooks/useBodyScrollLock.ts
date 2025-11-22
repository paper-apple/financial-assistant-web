// useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../utils/isSafari";

export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [isSafariBrowser]);
};
