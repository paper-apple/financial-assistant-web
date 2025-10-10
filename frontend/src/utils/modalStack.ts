// src/utils/modalStack.ts
//Создаёт идентификатор для текущего модального окна и добавляет его в список
let modalStack: number[] = [];
export let nextId = 0;

export const addModalToStack = (): number => {
  const id = Math.random(); // Уникальный ID вместо счётчика
  modalStack.push(id);
  return id;
};

export const removeModalFromStack = (id: number) => {
  modalStack = modalStack.filter(modalId => modalId !== id);
  nextId = 0;
};

export const getTopModalId = (): number | null => {
  return modalStack.length > 0 ? modalStack[modalStack.length - 1] : null;
};

export const getModalStack = (): number[] => {
  return [...modalStack]; // копия массива
};
