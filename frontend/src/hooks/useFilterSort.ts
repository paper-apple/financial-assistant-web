// hooks/useFilterSort.ts
import { useState, useCallback, useEffect } from "react";
import type { FilterParams, SortParams } from "../types";
import { useKeywordSuggestions } from "./useKeywordSuggestions";


// export const useFilterSort = (loadExpenses: (filters: FilterParams, sortParams: SortParams) => void) => {
//   const [sortFilters, setSortFilters] = useState<FilterParams>({
//     startDate: null,
//     endDate: null,
//     minPrice: null,
//     maxPrice: null,
//     keywords: [],
//   });

//   const [keywordInput, setKeywordInput] = useState('');
//   const [keywordsList, setKeywordsList] = useState<string[]>(sortFilters.keywords);
//   const [startDate, setStartDate] = useState<Date | null>(sortFilters.startDate)
//   const [endDate,   setEndDate]   = useState<Date | null>(sortFilters.endDate)
//   const [minPrice,  setMinPrice]  = useState(sortFilters.minPrice?.toString() ?? "")
//   const [maxPrice,  setMaxPrice]  = useState(sortFilters.maxPrice?.toString() ?? "")
//   const [dateError, setDateError]   = useState(false);
//   const [priceError, setPriceError] = useState(false);
  
//   const filtersState = {
//     keywordInput, setKeywordInput,
//     keywordsList, setKeywordsList,
//     startDate, setStartDate,
//     endDate, setEndDate,
//     minPrice, setMinPrice,
//     maxPrice, setMaxPrice,
//     dateError,
//     priceError,
//   };

//   const { suggestions, clearSuggestions } = useKeywordSuggestions({ input: keywordInput }); // ✅ корректно

//   const [sortParams, setSortParams] = useState<SortParams>({
//     field: 'datetime',
//     direction: 'DESC' as 'ASC' | 'DESC'
//   });

//   // const handleAddKeyword = (word: string) => {
//   //   if (!keywordsList.includes(word)) {
//   //     setKeywordsList(prev => [...prev, word]);
//   //   }
//   //   setKeywordInput('');
//   //   clearSuggestions();
//   // };

//   const handleAddKeyword = (word: string) => {
//     const trimmed = word.trim();
//     if (trimmed && !keywordsList.includes(trimmed)) {
//       setKeywordsList(prev => [...prev, trimmed]);
//     }
//     setKeywordInput('');
//     clearSuggestions();
//   };


//   const getCurrentFilters = useCallback((): FilterParams => ({
//     startDate,
//     endDate,
//     minPrice: minPrice ? Number(minPrice) : null,
//     maxPrice: maxPrice ? Number(maxPrice) : null,
//     keywords: keywordsList,
//   }), [startDate, endDate, minPrice, maxPrice, keywordsList]);

//   // const applyFilters = useCallback(() => {
//   //   const newFilters: FilterParams = {
//   //     startDate,
//   //     endDate,
//   //     minPrice: minPrice ? Number(minPrice) : null,
//   //     maxPrice: maxPrice ? Number(maxPrice) : null,
//   //     keywords: keywordsList,
//   //   };

//   //   handleFilters(newFilters);
//   // }, [startDate, endDate, minPrice, maxPrice, keywordsList]);

//   const applyFilters = () => handleFilters(getCurrentFilters());

//   const handleFilters = useCallback((newFilters: FilterParams) => {
//     setSortFilters(newFilters);
//     loadExpenses(newFilters, sortParams);
//   }, [loadExpenses, sortParams]);

//   const handleSortApply = useCallback((newSortParams: SortParams) => {
//     setSortParams(newSortParams);
//     loadExpenses(sortFilters, newSortParams);
//   }, [loadExpenses, sortFilters]);

//   // Валидация цен
//   useEffect(() => {
//     const min = parseFloat(minPrice);
//     const max = parseFloat(maxPrice);
//     setPriceError(!isNaN(min) && !isNaN(max) && min > max);
//   }, [minPrice, maxPrice]);

//   useEffect(() => {
//     if (startDate && endDate) {
//       setDateError(startDate > endDate);
//     } else {
//       setDateError(false);
//     }
//   }, [startDate, endDate]);

//   const handleReset = () => {
//     setKeywordInput("")
//     setKeywordsList([])
//     setStartDate(null)
//     setEndDate(null)
//     setMinPrice("")
//     setMaxPrice("")
//   }

//   return {
//     sortParams,
//     filtersState,
//     suggestions,
//     handleAddKeyword,
//     applyFilters,
//     handleSortApply,
//     handleReset
//   };
// };

// useFilterSort.ts
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

  const { suggestions, clearSuggestions } = useKeywordSuggestions({ input: keywordInput });

  // const [sortParams, setSortParams] = useState<SortParams>({
  //   field: 'datetime',
  //   direction: 'DESC',
  // });



  // Собираем фильтры из текущего состояния
  const getCurrentFilters = useCallback((): FilterParams => ({
    startDate,
    endDate,
    minPrice: minPrice ? Number(minPrice) : null,
    maxPrice: maxPrice ? Number(maxPrice) : null,
    keywords: keywordsList,
  }), [startDate, endDate, minPrice, maxPrice, keywordsList]);


  // const [sortField, setSortField] = useState<SortParams['field']>(sortParams.field);
  // const [sortDirection, setSortDirection] = useState<SortParams['direction']>(sortParams.direction);

  const [sortField, setSortField] = useState<SortParams['field']>("datetime");
  const [sortDirection, setSortDirection] = useState<SortParams['direction']>("DESC");

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
    // setSortParams(newSort);
    loadExpenses(getCurrentFilters(), getCurrentSorts());
  }, [getCurrentFilters, getCurrentSorts, loadExpenses]);

  const handleResetFilters = () => {
    setKeywordInput('');
    setKeywordsList([]);
    setStartDate(null);
    setEndDate(null);
    setMinPrice('');
    setMaxPrice('');
  };

  // Валидация цен
  useEffect(() => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    setPriceError(!isNaN(min) && !isNaN(max) && min > max);
  }, [minPrice, maxPrice]);

  // Валидация дат
  useEffect(() => {
    setDateError(Boolean(startDate && endDate && startDate > endDate));
  }, [startDate, endDate]);

  return {
    // sortParams,
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
    },
    suggestions,
    handleAddKeyword,
    applyFilters,
    applySorts,
    handleResetFilters,
  };
};
