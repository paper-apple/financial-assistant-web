// hooks/useSelection.ts
import { useState } from "react";
import type { Expense } from "../types";

export const useSelection = (expenses: Expense[]) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleLongPress = (id: number) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedIds([id]);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async (removeFn: (ids: number[]) => Promise<void>) => {
    await removeFn(selectedIds);
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleCancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    setSelectedIds(selectedIds.length === expenses.length 
      ? [] 
      : expenses.map(e => e.id));
  };

  return {
    selectionMode,
    selectedIds,
    handleLongPress,
    handleSelect,
    handleDeleteSelected,
    handleCancelSelection,
    handleSelectAll
  };
};