// useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../utils/isSafari";

export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    if (document.documentElement.scrollHeight > window.innerHeight) {
      if (!isSafariBrowser) {
        document.documentElement.classList.add('hide-scrollbar');
      }
      // document.body.style.overflow = "hidden";
      

      return () => {
        if (!isSafariBrowser) {
          document.documentElement.classList.remove('hide-scrollbar');
        }
        // document.body.style.overflow = "";
      };
    }
  }, [isSafariBrowser]);
};
