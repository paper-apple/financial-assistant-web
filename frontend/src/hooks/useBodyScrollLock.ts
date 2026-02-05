// useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../utils/isSafari";

export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    let originalPaddingRight: string = ""
    if (!isSafariBrowser) {
      originalPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = "16px"
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      if (!isSafariBrowser) {
        document.body.style.paddingRight = originalPaddingRight;
      }
      document.body.style.overflow = originalOverflow;
    };
  }, [isSafariBrowser]);
};
