// // src/hooks/useBodyScrollLock.ts
// import { useEffect } from "react";
// import { isSafari } from "../tests/utils/isSafari";

// export const useBodyScrollLock = () => {
//   useEffect(() => {
//     const originalOverflow = window.getComputedStyle(document.body).overflow;
//     let originalPaddingRight: string | null = null;

//     document.body.style.overflow = "hidden";

//     if (!isSafari) {
//       originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
//       document.body.style.paddingRight = "16px";
//     }

//     return () => {
//       document.body.style.overflow = originalOverflow;
//       if (!isSafari && originalPaddingRight !== null) {
//         document.body.style.paddingRight = originalPaddingRight;
//       }
//     };
//   }, []);
// };


// src/hooks/useBodyScrollLock.ts
import { useEffect } from "react";
import { isSafari } from "../tests/utils/isSafari";
// import { isSafari } from "../utils/isSafari";

export const useBodyScrollLock = (isSafariBrowser = isSafari) => {
  useEffect(() => {
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    let originalPaddingRight: string | null = null;

    document.body.style.overflow = "hidden";

    if (!isSafariBrowser) {
      originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
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