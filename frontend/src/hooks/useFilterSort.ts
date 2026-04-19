// useFilterSort.ts
import { useState, useCallback, useEffect, useRef } from "react";
import type { FilterParams, GroupField, SortParams, StatsModeField } from "../types";
import { useKeywordSuggestions } from "./useKeywordSuggestions";

export const useFilterSort = (
  loadExpenses: (filters: FilterParams, sortParams: SortParams) => void
) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [dateError, setDateError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [sortField, setSortField] = useState<SortParams['field']>("datetime");
  const [sortDirection, setSortDirection] = useState<SortParams['direction']>("DESC");
  const [statsField, setStatsField] = useState<GroupField>('category');
  const [statsMode, setStatsMode] = useState<StatsModeField>('table');
  const { suggestions, clearSuggestions } = useKeywordSuggestions({ input: keywordInput });

  const initialValuesRef = useRef<{
    keywordsList: string[];
    startDate: Date | null;
    endDate: Date | null;
    minPrice: string;
    maxPrice: string;
  } | null>(null);

  const backup = () => {
    initialValuesRef.current = {
      keywordsList: [...keywordsList],
      startDate,
      endDate,
      minPrice,
      maxPrice,
    };
  }

  const restoreInitialValues = () => {
    if (!initialValuesRef.current) return;

    const {
      keywordsList,
      startDate,
      endDate,
      minPrice,
      maxPrice,
    } = initialValuesRef.current;

    setKeywordsList(keywordsList);
    setStartDate(startDate);
    setEndDate(endDate);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const getCurrentFilters = useCallback((): FilterParams => ({
    startDate,
    endDate,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    keywords: keywordsList,
  }), [startDate, endDate, minPrice, maxPrice, keywordsList]);

  const getCurrentSorts = useCallback((): SortParams => ({
    field: sortField,
    direction: sortDirection
  }
  ), [sortField, sortDirection]);

  const handleAddKeyword = (word: string) => {
    const trimmed = word.trim();
    if (trimmed && !keywordsList.includes(trimmed)) {
      setKeywordsList(prev => [...prev, trimmed]);
    }
    setKeywordInput('');
    clearSuggestions();
  };

  const applyFilters = useCallback(() => {
    loadExpenses(getCurrentFilters(), getCurrentSorts());
  }, [getCurrentFilters, getCurrentSorts, loadExpenses]);

  const applySorts = useCallback(() => {
    loadExpenses(getCurrentFilters(), getCurrentSorts());
  }, [getCurrentFilters, getCurrentSorts, loadExpenses]);

  const applyStatsField = (field: GroupField) => {
    setStatsField(field);
  };

  const applyStatsMode = (mode: StatsModeField) => {
    setStatsMode(mode);
  };

  const handleResetFilters = () => {
    setKeywordInput('');
    setKeywordsList([]);
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
    setSortField('datetime')
    setStatsField('category')
    setStatsMode('table')
  };

  useEffect(() => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    setPriceError(!isNaN(min) && !isNaN(max) && min > max);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    setDateError(Boolean(startDate && endDate && startDate > endDate));
  }, [startDate, endDate]);

  return {
    sortState: {
      sortField, setSortField,
      sortDirection, setSortDirection,
    },
    filtersState: {
      keywordInput, setKeywordInput,
      keywordsList, setKeywordsList,
      startDate, setStartDate,
      endDate, setEndDate,
      minPrice, setMinPrice,
      maxPrice, setMaxPrice,
      dateError,
      priceError,
      backup,
      restoreInitialValues,
      handleResetFilters,
    },
    statsState: {
      statsField,
      applyStatsField,
      statsMode,
      applyStatsMode
    },
    suggestions,
    handleAddKeyword,
    applyFilters,
    applySorts,
  };
};
