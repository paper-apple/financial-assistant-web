// useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../utils/isSafari";

export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    let originalPaddingRight: string | null = null;

    document.body.style.overflow = "hidden";

    if (!isSafariBrowser) {
      originalPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = "16px";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (!isSafariBrowser && originalPaddingRight !== null) {
        document.body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [isSafariBrowser]);
};