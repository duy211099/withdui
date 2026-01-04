import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isToday,
  isValid,
  parseISO,
} from 'date-fns'
import { enUS, vi } from 'date-fns/locale'

export type LocalTimeType =
  | 'time'
  | 'date'
  | 'time-ago'
  | 'time-or-date'
  | 'weekday'
  | 'weekday-or-date'

export function normalizeLocale(locale?: string | null) {
  const short = locale?.split('-')[0]
  return short === 'en' || short === 'vi' ? short : 'vi'
}

function getLocale(locale?: string | null) {
  return normalizeLocale(locale) === 'vi' ? vi : enUS
}

function parseDateTime(dateTime: string, dateOnly: boolean) {
  if (!dateTime) return null
  const parsed = parseISO(dateOnly ? dateTime : dateTime)
  return isValid(parsed) ? parsed : null
}

export function toLocalDateISOString(dateString: string) {
  return dateString
}

export function getLongDateFormat(locale: string) {
  return locale === 'vi' ? 'EEEE, dd/MM/yyyy' : 'EEEE, MMMM d, yyyy'
}

export function getShortDateFormat(locale: string) {
  return locale === 'vi' ? 'dd/MM' : 'MMM d'
}

export function getDateTimeFormat(locale: string) {
  return locale === 'vi' ? 'dd/MM/yyyy HH:mm' : 'MMM d, yyyy h:mm a'
}

export function getFullDateTimeFormat(locale: string) {
  return locale === 'vi' ? 'EEEE, dd/MM/yyyy HH:mm:ss' : 'EEEE, MMMM d, yyyy h:mm:ss a'
}

export function formatLocalDate(date?: Date, formatString?: string, locale?: string) {
  if (!date || !formatString) return ''
  return format(date, formatString, { locale: getLocale(locale) })
}

export function getWeekdayShortNames(locale: string) {
  const base = new Date(2024, 0, 7)
  return Array.from({ length: 7 }, (_, i) =>
    format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i), 'EEE', {
      locale: getLocale(locale),
    })
  )
}

export function formatLocalTimeValue(
  dateTime: string,
  options: {
    locale?: string
    localType?: LocalTimeType
    format?: string
    dateOnly?: boolean
  }
) {
  const { locale, localType = 'date', format: formatString, dateOnly = false } = options
  const parsed = parseDateTime(dateTime, dateOnly)
  if (!parsed) return ''

  if (formatString) {
    return format(parsed, formatString, { locale: getLocale(locale) })
  }

  const localeValue = getLocale(locale)
  switch (localType) {
    case 'time':
      return format(parsed, 'p', { locale: localeValue })
    case 'date':
      return format(parsed, 'P', { locale: localeValue })
    case 'time-ago':
      return formatDistanceToNow(parsed, { addSuffix: true, locale: localeValue })
    case 'time-or-date':
      return isToday(parsed)
        ? format(parsed, 'p', { locale: localeValue })
        : format(parsed, 'P', { locale: localeValue })
    case 'weekday':
      return format(parsed, 'EEEE', { locale: localeValue })
    case 'weekday-or-date': {
      const days = Math.abs(differenceInCalendarDays(parsed, new Date()))
      return days <= 6
        ? format(parsed, 'EEEE', { locale: localeValue })
        : format(parsed, 'P', { locale: localeValue })
    }
    default:
      return format(parsed, 'P', { locale: localeValue })
  }
}
