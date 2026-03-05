// useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../utils/isSafari";


export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    if (document.documentElement.scrollHeight > window.innerHeight) {
        document.documentElement.classList.add('hide-scrollbar');

      return () => {
        document.documentElement.classList.remove('hide-scrollbar');
      };
    }
  }, [isSafariBrowser]);
};
