import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSelection } from '../../hooks/useSelection';
import type { Expense } from "../../types";

const mockExpenses: Expense[] = [
  {
    id: 1,
    title: "Coffee",
    category: "Food",
    price: 3,
    location: "Cafe",
    datetime: "2024-05-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Book",
    category: "Education",
    price: 15,
    location: "Bookstore",
    datetime: "2024-04-25T09:00:00Z",
  },
  {
    id: 3,
    title: "Tea",
    category: "Food",
    price: 2,
    location: "Cafe",
    datetime: "2024-05-03T15:00:00Z",
  },
];

describe('useSelection', () => {
  it('начальное состояние', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    expect(result.current.selectionMode).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it('handleLongPress включает selectionMode и выделяет id', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleLongPress(2);
    });

    expect(result.current.selectionMode).toBe(true);
    expect(result.current.selectedIds).toEqual([2]);
  });

  it('handleLongPress не меняет выделение, если selectionMode уже true', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleLongPress(1); // включает режим
    });

    act(() => {
      result.current.handleLongPress(2); // повторный long press
    });

    expect(result.current.selectedIds).toEqual([1]); // без замены
  });

  it('handleSelect добавляет id, если его нет', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelect(1);
    });

    expect(result.current.selectedIds).toEqual([1]);
  });

  it('handleSelect убирает id, если он уже есть', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelect(1);
      result.current.handleSelect(1);
    });

    expect(result.current.selectedIds).toEqual([]);
  });

  it('handleDeleteSelected вызывает removeFn с выделенными и сбрасывает состояние', async () => {
    const removeFn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelect(2);
      result.current.handleSelect(3);
    });

    await act(async () => {
      await result.current.handleDeleteSelected(removeFn);
    });

    expect(removeFn).toHaveBeenCalledWith([2, 3]);
    expect(result.current.selectionMode).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it('handleCancelSelection сбрасывает выделение и режим', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelect(1);
      result.current.handleCancelSelection();
    });

    expect(result.current.selectionMode).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it('handleSelectAll выделяет все, если не все выбраны', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelectAll();
    });

    expect(result.current.selectedIds).toEqual([1, 2, 3]);
  });

  it('handleSelectAll снимает выделение, если все выбраны', () => {
    const { result } = renderHook(() => useSelection(mockExpenses));

    act(() => {
      result.current.handleSelectAll(); // выбрать все
    });

    act(() => {
      result.current.handleSelectAll(); // снять выбор
    });

    expect(result.current.selectedIds).toEqual([]);
  });
});
