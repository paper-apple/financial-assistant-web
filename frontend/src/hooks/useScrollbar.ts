// hooks/useScrollbar.ts
import { useState, useEffect } from 'react';

export const useScrollbar = () => {
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const checkScrollbar = () => {
      // Проверяем, есть ли вертикальный скроллбар
      const hasVerticalScrollbar = document.documentElement.scrollHeight > window.innerHeight;
      
      if (hasVerticalScrollbar) {
        // Вычисляем ширину скроллбара
        const width = window.innerWidth - document.documentElement.clientWidth;
        setScrollbarWidth(width);
        setHasScrollbar(true);
      } else {
        setScrollbarWidth(0);
        setHasScrollbar(false);
      }
    };

    // Проверяем при монтировании
    checkScrollbar();

    // Проверяем при изменении размера окна
    window.addEventListener('resize', checkScrollbar);
    
    // Проверяем при изменении контента (мутации DOM)
    const observer = new ResizeObserver(checkScrollbar);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('resize', checkScrollbar);
      observer.disconnect();
    };
  }, [hasScrollbar]);

  return { hasScrollbar, scrollbarWidth };
};