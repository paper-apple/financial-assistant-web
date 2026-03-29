// FilterForm.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FiltersState, Modals } from '../../types';
import { handlePriceChange } from '../../utils/sanitizePrice';
import { FormField } from '../ui/FormField';
import { useFilterFormValidation } from '../../hooks/useFilterFormValidation';
import { ErrorBar } from './ErrorBar';
import { TranslationKey, useTranslation } from '../../hooks/useTranslation';

interface FilterFormProps {
  suggestions: string[];
  filtersState: FiltersState;
  handleAddKeyword: (word: string) => void;
  applyFilters: () => void;
  onModalOpen: (modal: keyof Modals) => void;
  onModalClose: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  suggestions,
  filtersState,
  applyFilters,
  handleAddKeyword,
  onModalOpen: openModal,
  onModalClose: onClose
}) => {
  const {
    keywordInput, setKeywordInput,
    keywordsList, setKeywordsList,
    startDate, setStartDate,
    endDate, setEndDate,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    backup,
    restoreInitialValues,
    handleResetFilters,
  } = filtersState;

  useEffect(() => {
    backup();
  }, []);

  const { t } = useTranslation()
  
  const { dateError, priceError, validateAndSubmit, isValid } =
    useFilterFormValidation({startDate, endDate, minPrice, maxPrice});

  const wasAppliedRef = useRef(false);

  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  const errorText = useMemo(() => {
    let error: TranslationKey = 'incorrect_price';
    if (dateError) error = "incorrect_date";
    if (priceError && dateError) error = "incorrect_date_and_price";
    
    return error;
  }, [priceError, dateError]);

  const handleApply = () => {
    if (!isValid()) {
      setShowErrorTooltip(true);
    }
    validateAndSubmit(() => {
      wasAppliedRef.current = true;
      applyFilters();
      onClose();
    });
  };

  useEffect(() => {
    return () => {
      if (!wasAppliedRef.current) {
        restoreInitialValues();
      };
    }
  },[]);

  useEffect(() => {
    if (showErrorTooltip) {
      const timer = setTimeout(() => {
        setShowErrorTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorTooltip]);

  return (
    <div>
      {/* Блок добавления ключевых слов */}
      <label className="label-text">{t('keyword_search')}</label>
      <div className="p-2 relative rounded-t-lg border border-(--input-border)">
        <div className="flex items-end gap-2 pb-2">
          <FormField
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder={t('keyword_plaseholder')}
            suggestions={suggestions}
            onSuggestionSelect={(val) => handleAddKeyword(val)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setKeywordsList([])} className="w-full btn-base btn-cancel">
            {t('clear_list')}
          </button>
          <button onClick={() => handleAddKeyword(keywordInput)} className="w-full btn-base btn-confirm">
            {t('add_word')}
        </button>
        </div>
      </div>

      {/* Блок ключевых слов */}
      <div className="border-x border-b border-(--input-border) rounded-b-lg mb-2">
        <div className="rounded-lg pl-2 pt-2 pb-2 flex flex-wrap items-start gap-1 min-h-[88px] max-h-[88px] overflow-y-auto">
          {keywordsList.length > 0 ? (
            keywordsList.map((word) => (
              <span
                key={word}
                className="inline-flex items-center h-8 border border-(--input-border) text-sm font-semibold tracking-wide px-2 rounded-md"
              >
                <button
                  onClick={() =>
                    setKeywordsList((prev) => prev.filter((k) => k !== word))
                  }
                  className="text-(--text) text-sm font-semibold tracking-wide cursor-pointer" 
                >
                  {word} ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-(--tip-text) text-sm w-full text-center pt-6">{t('keywords_are_not_added')}</span>
          )}
        </div>
      </div>
      
      {/* Блок добавления интервала времени */}
      <div>
        <label className="label-text">{t('time_interval')}</label>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <FormField
            testId="input-date-from"
            value={
              startDate
                ? startDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(',', '')
                : ""
            }
            placeholder={t('from')}
            error={dateError}
            readOnly
            calendarOpen={() => openModal("startDate")}
            onClear={() => setStartDate(null)}
          />
          <FormField
            testId="input-date-to"
            value={
              endDate
                ? endDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(',', '')
                : ""
            }
            placeholder={t('to')}
            error={dateError}
            readOnly
            calendarOpen={() => openModal("endDate")}
            onClear={() => setEndDate(null)}
          />
        </div>
      </div>

      {/* Блок добавления интервала цен */}
      <div>
        <label className="label-text">{t('price_range')}</label>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              value={minPrice}
              onChange={e => handlePriceChange(e.target.value, setMinPrice)}
              placeholder={t('from')}
              error={priceError}
            />
            <FormField
              value={maxPrice}
              onChange={e => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder={t('to')}
              error={priceError}
            />
          </div>
      </div>
      <div className="relative">
        {(showErrorTooltip && (dateError || priceError)) && (
          <div>
            <ErrorBar errorText={errorText}/>
          </div>
        )}
      </div>
      
      {/* Кнопки */}
      <div className="flex gap-2 mt-3">
        <button onClick={onClose} className="btn-base btn-cancel">{t('cancel')}</button>
        <button onClick={handleResetFilters} className="btn-base btn-cancel">{t('reset')}</button>
        <button onClick={handleApply} className={`btn-base
          ${ isValid() ? "btn-confirm" : "btn-disabled"}`}>
            {t('apply')}
        </button>
      </div>
    </div>
  );
};
