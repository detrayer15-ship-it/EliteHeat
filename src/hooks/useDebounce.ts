import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Useful for search inputs, form validation, and API calls
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     // Make API call
 *   }
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up the timeout
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up on value or delay change
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for debouncing callback functions
 * Useful when you need to debounce a function rather than a value
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            callback(...args);
        }, delay);

        setTimeoutId(newTimeoutId);
    };
}

/**
 * Hook for throttling values
 * Unlike debounce, throttle ensures the value updates at most once per interval
 * 
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in milliseconds
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

    useEffect(() => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdated;

        if (timeSinceLastUpdate >= interval) {
            setThrottledValue(value);
            setLastUpdated(now);
        } else {
            const timeoutId = setTimeout(() => {
                setThrottledValue(value);
                setLastUpdated(Date.now());
            }, interval - timeSinceLastUpdate);

            return () => clearTimeout(timeoutId);
        }
    }, [value, interval, lastUpdated]);

    return throttledValue;
}

export default useDebounce;
