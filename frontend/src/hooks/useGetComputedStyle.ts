// useGetComputedStyle.ts

export const getColor = (elem: string) => {
  // Получаем значение CSS-переменной
  const color = getComputedStyle(document.body)
    .getPropertyValue(elem)
    .trim();
  return color
}