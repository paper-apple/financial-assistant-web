// import React, { useState } from 'react';
// import { login, register } from '../api';
// import type { AxiosResponse } from 'axios';

// type Props = {
//   onAuth: (authData: any) => void
//   isLogin: boolean
// };

// export default function AuthForm({ onAuth, isLogin }: Props) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await (isLogin ? login : register)(username, password);
//       onAuth(response.data);
//     } catch (err: any) {
//       if (err.response?.status === 409) {
//         setError('Такой пользователь уже существует');
//       } else if (err.response?.status === 401) {
//         setError('Неверный логин или пароль');
//       } else {
//         setError('Ошибка авторизации');
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Логин"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Пароль"
//       />
//       <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
//       {error && <div>{error}</div>}
//     </form>
//   );
// }