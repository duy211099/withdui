import { useMemo } from 'react'
import { useI18n } from '@/contexts/I18nContext'
import { formatLocalTimeValue, type LocalTimeType, toLocalDateISOString } from '@/lib/localTime'

interface LocalTimeProps {
  dateTime: string
  localType?: LocalTimeType
  format?: string
  className?: string
  dateOnly?: boolean
}

export default function LocalTime({
  dateTime,
  localType = 'date',
  format,
  className,
  dateOnly = false,
}: LocalTimeProps) {
  const { locale } = useI18n()
  const normalizedDateTime = useMemo(() => {
    if (dateOnly) return toLocalDateISOString(dateTime)
    const parsed = new Date(dateTime)
    return Number.isNaN(parsed.valueOf()) ? dateTime : parsed.toISOString()
  }, [dateOnly, dateTime])
  const formattedText = useMemo(
    () => formatLocalTimeValue(dateTime, { locale, localType, format, dateOnly }),
    [dateOnly, dateTime, format, locale, localType]
  )

  return (
    <time dateTime={normalizedDateTime} className={className}>
      {formattedText}
    </time>
  )
}
