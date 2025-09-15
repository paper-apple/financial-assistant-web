// hooks/useLongPress.ts
import { useRef, useCallback } from "react";

type Options = {
  onLongPress: () => void;
  delay?: number; // по умолчанию 400 мс
};

export function useLongPress({ onLongPress, delay = 400 }: Options) {
  const timerRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const longPressTriggered = useRef(false);

  const start = useCallback(() => {
    movedRef.current = false;
    longPressTriggered.current = false;
    timerRef.current = window.setTimeout(() => {
      if (!movedRef.current) {
        onLongPress();
        longPressTriggered.current = true;
      }
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const move = useCallback(() => {
    movedRef.current = true;
    cancel();
  }, [cancel]);

  const wasLongPress = useCallback(() => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return true;
    }
    return false;
  }, []);

  return { start, cancel, move, wasLongPress };
}
