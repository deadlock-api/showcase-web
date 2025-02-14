import { type ClassValue, clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function useDebouncedState<S>(initialState: S, delay = 300): [S, S, (state: S) => void] {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedState] = useState(initialState);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedState(state), delay);
    return () => clearTimeout(timer);
  }, [state, delay]);

  return [state, debouncedState, setState];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}
