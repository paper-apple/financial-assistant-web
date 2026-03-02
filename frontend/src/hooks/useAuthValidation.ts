// // useAuthValidation.ts
// import { useCallback } from "react";

// export function useAuthValidation() {
//   const validateUsername = useCallback((username: string) => {
//     if (username.trim().length <= 1) {
//       return "Имя пользователя должно быть длиннее одного символа";
//     }
//     return "";
//   }, []);

//   const validatePassword = useCallback((password: string) => {
//     const minLength = /.{6,}/;
//     const hasUpper = /[A-Z]/;
//     const hasLower = /[a-z]/;
//     const hasDigit = /\d/;

//     if (!minLength.test(password)) {
//       return "Пароль должен содержать минимум 6 символов";
//     }
//     if (!hasUpper.test(password)) {
//       return "Пароль должен содержать хотя бы одну заглавную букву";
//     }
//     if (!hasLower.test(password)) {
//       return "Пароль должен содержать хотя бы одну строчную букву";
//     }
//     if (!hasDigit.test(password)) {
//       return "Пароль должен содержать хотя бы одну цифру";
//     }
//     return "";
//   }, []);

//   // const isValid = useCallback((username: string, password: string) => {
//   //   return !validateUsername(username) && !validatePassword(password);
//   // }, [validateUsername, validatePassword]);

//   return { validateUsername, validatePassword };
// }
