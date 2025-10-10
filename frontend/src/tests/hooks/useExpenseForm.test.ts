// useExpenseForm.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from '@testing-library/react';
import { useExpenseForm } from '../../hooks/useExpenseForm';
import type { Expense } from '../../types';
import { makeCategory, makeLocation } from "../createCategoryAndLocationFields"

// Моковые данные для тестов
const mockExpense: Expense = {
  id: 1,
  title: 'Хлеб',
  category: makeCategory(1, "Еда"),
  location: makeLocation(1, "Копеечка"),
  price: 3,
  datetime: '2025-01-01T12:00:00.000Z'
};

describe('useExpenseForm', () => {
  it('инициализация с пустой формой', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    expect(result.current.form).toEqual({
      title: '',
      category: '',
      price: '',
      location: '',
      datetime: expect.any(String) // Дата должна быть строкой
    });
    
    expect(result.current.editingExpense).toBeNull();
  });

  it('updateFormField обновляет поле формы', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      result.current.updateFormField('title', 'Макароны');
    });
    
    expect(result.current.form.title).toBe('Макароны');
    expect(result.current.form.category).toBe(''); // Другие поля не изменились
  });

  it('updateFormField обновляет поля формы', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      result.current.updateFormField('title', 'Кеды');
      result.current.updateFormField('price', '99');
      result.current.updateFormField('category', 'Обувь');
    });
    
    expect(result.current.form).toEqual({
      title: 'Кеды',
      category: 'Обувь',
      price: '99',
      location: '',
      datetime: expect.any(String)
    });
  });

    it('updateFormField заменяет данные в полях формы', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      result.current.updateFormField('title', 'First');
    });
    
    expect(result.current.form.title).toBe('First');
    
    act(() => {
      result.current.updateFormField('title', 'Second');
    });
    
    expect(result.current.form.title).toBe('Second');
    // Другие поля остались без изменений
    expect(result.current.form.category).toBe('');
  });

  it('setEditingExpense обновляет editingExpense', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      result.current.setEditingExpense(mockExpense);
    });
    
    expect(result.current.editingExpense).toEqual(mockExpense);
  });

  it('setFormFromExpense обновляет форму и editingExpense', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      result.current.setFormFromExpense(mockExpense);
    });
    
    expect(result.current.form).toEqual({
      title: 'Хлеб',
      category: 'Еда',
      price: '3',
      location: 'Копеечка',
      datetime: '2025-01-01T12:00:00.000Z'
    });
    // editingExpense не должен измениться при setFormFromExpense
    expect(result.current.editingExpense).toEqual(mockExpense);
  });

  it('resetForm очищает form и editingExpense', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    // Сначала заполняем форму
    act(() => {
      // result.current.updateFormField('title', 'Test');
      // result.current.updateFormField('price', '200');
      result.current.setFormFromExpense(mockExpense);
      
    });
    
    // Проверяем что форма заполнена
    expect(result.current.form.title).toBe('Хлеб');
    expect(result.current.editingExpense).not.toBeNull();
    
    // Сбрасываем
    act(() => {
      result.current.resetForm();
    });
    
    // Проверяем сброс
    expect(result.current.form).toEqual({
      title: '',
      category: '',
      price: '',
      location: '',
      datetime: expect.any(String)
    });
    expect(result.current.editingExpense).toBeNull();
  });

  it('setEditingExpense(null) сбрасывет форму и setEditingExpense', () => {
    const { result } = renderHook(() => useExpenseForm());
    
    // Сначала устанавливаем расход
    act(() => {
      result.current.setEditingExpense(mockExpense);
    });
    
    // Затем сбрасываем в null
    act(() => {
      result.current.setEditingExpense(null);
    });
    
    expect(result.current.editingExpense).toBeNull();
    expect(result.current.form).toEqual({
      title: '',
      category: '',
      price: '',
      location: '',
      datetime: expect.any(String)
    });
  });

  it('частичное заполнение формы', () => {
    const partialExpense: Partial<Expense> = {
      title: 'Кресло',
      price: 250
    };
    
    const { result } = renderHook(() => useExpenseForm());
    
    act(() => {
      // @ts-ignore - тестируем с частичным объектом
      result.current.setFormFromExpense(partialExpense);
    });
    
    expect(result.current.form).toEqual({
      title: 'Кресло',
      category: '',
      price: '250',
      location: '',
      datetime: expect.any(String)
    });
  });
});
