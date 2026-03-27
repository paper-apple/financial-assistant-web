// getSelectionText.ts
// export function getSelectionText(count: number, confirmDelete: boolean) {
//   const forms = ["запись", "записи", "записей"];

//   const getWordForm = (n: number) => {
//     const mod10 = n % 10;
//     const mod100 = n % 100;
//     if (mod10 === 1 && mod100 !== 11) return forms[0];
//     if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
//     return forms[2];
//   };

//   const mod10 = count % 10;
//   const mod100 = count % 100;
//   const isSingular = mod10 === 1 && mod100 !== 11;

//   if (confirmDelete) {
//     return `Удалить ${count} ${getWordForm(count)}?`;
//   } else {
//     return `Выбран${isSingular ? "а" : "о"} ${count} ${getWordForm(count)}`;
//   }
// }

// utils/getSelectionText.ts
import { Language } from '../context/SettingsContext';

export function getSelectionText(
  count: number, 
  confirmDelete: boolean, 
  language: Language
) {
  // Английская версия
  if (language === 'en') {
    const recordWord = count === 1 ? 'record' : 'records';
    
    if (confirmDelete) {
      return `Delete ${count} ${recordWord}?`;
    } else {
      return `Selected ${count} ${recordWord}`;
    }
  }
  
  // Русская версия
  const forms = ["запись", "записи", "записей"];

  const getWordForm = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  };

  const isSingular = count % 10 === 1 && count % 100 !== 11;
  const wordForm = getWordForm(count);

  if (confirmDelete) {
    return `Удалить ${count} ${wordForm}?`;
  } else {
    return `Выбран${isSingular ? "а" : "о"} ${count} ${wordForm}`;
  }
}