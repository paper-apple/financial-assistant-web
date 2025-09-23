export function getSelectionText(count: number, confirmDelete: boolean) {
  // Склонения для слова "запись"
  const forms = ["запись", "записи", "записей"];

  const getWordForm = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
    return forms[2];
  };

  if (confirmDelete) {
    return `Удалить ${count} ${getWordForm(count)}?`
  } else {
    return `Выбран${count === 1 ? "а" : "о"} ${count} ${getWordForm(count)}`;
  }
}
