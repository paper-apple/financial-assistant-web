// useKeywordSuggestions
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { suggestKeywords } from '../api';

export function useKeywordSuggestions({
  field,
  input,
}: {
  field?: 'title' | 'category' | 'location',
  input: string,
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await suggestKeywords(value, field);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Ошибка при получении подсказок:', err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(input);
  }, [input]);

  const clearSuggestions = () => setSuggestions([]);

  return { suggestions, clearSuggestions };
}
