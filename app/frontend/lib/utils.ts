import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utility functions

/**
 * Normalize a date to midnight (00:00:00) for accurate date-only comparisons
 */
export function normalizeDateToMidnight(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * Check if a given date is today
 */
export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date()
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  )
}

/**
 * Check if a given date is in the future (after today)
 */
export function isFutureDate(year: number, month: number, day: number): boolean {
  const today = normalizeDateToMidnight(new Date())
  const checkDate = normalizeDateToMidnight(new Date(year, month - 1, day))
  return checkDate > today
}

/**
 * Check if a date string (YYYY-MM-DD) is in the future
 */
export function isDateStringInFuture(dateString: string): boolean {
  const today = normalizeDateToMidnight(new Date())
  const checkDate = normalizeDateToMidnight(new Date(`${dateString}T00:00:00`))
  return checkDate > today
}

/**
 * Format a date string (YYYY-MM-DD) to a human-readable format
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = new Date(`${dateString}T00:00:00`)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return dateObj.toLocaleDateString('en-US', options || defaultOptions)
}
