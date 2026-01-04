import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import { formatLocalDate, getLongDateFormat, getWeekdayShortNames } from '@/lib/localTime'
import { cn, isFutureDate, isToday } from '@/lib/utils'
import type { Mood } from '@/types'

interface MoodCalendarProps {
  year: number
  month: number
  moods: Mood[]
  onMonthChange: (year: number, month: number) => void
  onDayClick: (day: number, moods: Mood[]) => void
  showUserAvatars?: boolean
  canEdit?: boolean
}

export default function MoodCalendar({
  year,
  month,
  moods,
  onMonthChange,
  onDayClick,
  showUserAvatars = false,
  canEdit = true,
}: MoodCalendarProps) {
  const { t, locale } = useI18n()
  // Calculate calendar grid dimensions
  const firstDayOfMonth = new Date(year, month - 1, 1)
  const lastDayOfMonth = new Date(year, month, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 6 = Saturday

  // For multi-user view, we need to group moods by date since multiple users can have moods on the same day
  const moodsByDate = moods.reduce(
    (acc, mood) => {
      if (!acc[mood.entry_date]) {
        acc[mood.entry_date] = []
      }
      acc[mood.entry_date].push(mood)
      return acc
    },
    {} as Record<string, Mood[]>
  )

  // Generate array of day numbers to display
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Calculate empty cells before first day
  const emptyStartCells = Array.from({ length: startDayOfWeek }, (_, i) => `start-${i}`)

  // Calculate total cells needed (must be multiple of 7)
  const totalCells = startDayOfWeek + daysInMonth
  const emptyEndCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const emptyEndCells = Array.from({ length: emptyEndCount }, (_, i) => `end-${i}`)

  const capitalizeFirst = (value: string) =>
    value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value
  const monthLabelLong = formatLocalDate(new Date(year, month - 1, 1), 'MMMM - yyyy', locale)
  const monthLabelShort = formatLocalDate(new Date(year, month - 1, 1), 'MMM - yyyy', locale)
  const weekdayNames = getWeekdayShortNames(locale)
  const dayHeaders =
    weekdayNames.length === 7
      ? weekdayNames
      : Array.from({ length: 7 }, (_, i) => formatLocalDate(new Date(2024, 0, 7 + i), '%a', locale))

  // Handle month navigation
  const handlePrevMonth = () => {
    const newMonth = month === 1 ? 12 : month - 1
    const newYear = month === 1 ? year - 1 : year
    onMonthChange(newYear, newMonth)
  }

  const handleNextMonth = () => {
    const newMonth = month === 12 ? 1 : month + 1
    const newYear = month === 12 ? year + 1 : year
    onMonthChange(newYear, newMonth)
  }

  return (
    <Card className="p-4 sm:p-6 hover:translate-x-0 hover:translate-y-0">
      {/* Month navigation header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          aria-label={t('frontend.moods.calendar.previous_month')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <h2 className="text-lg sm:text-2xl font-bold text-center">
          <span className="sm:hidden">{capitalizeFirst(monthLabelShort)}</span>
          <span className="hidden sm:inline">{capitalizeFirst(monthLabelLong)}</span>
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          aria-label={t('frontend.moods.calendar.next_month')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayHeaders.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-semibold text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before first day */}
        {emptyStartCells.map((key) => (
          <div key={`${year}-${month}-${key}`} className="aspect-square" />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayMoods = moodsByDate[date] || []
          const primaryMood = dayMoods[0] // Use first mood for styling
          const hasMultipleMoods = dayMoods.length > 1
          const today = isToday(year, month, day)
          const isFuture = isFutureDate(year, month, day)
          const dateLabel = formatLocalDate(
            new Date(year, month - 1, day),
            getLongDateFormat(locale),
            locale
          )

          return (
            <Button
              type="button"
              key={day}
              variant="ghost"
              onClick={() => onDayClick(day, dayMoods)}
              disabled={isFuture}
              className={cn(
                'aspect-square rounded-lg border-2 transition-all',
                'flex flex-col items-center justify-center relative',
                'w-full h-auto p-0',
                today ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border',
                isFuture || !canEdit
                  ? 'cursor-not-allowed opacity-40 bg-muted/50'
                  : 'hover:border-primary hover:shadow-md',
                primaryMood && !isFuture && canEdit
                  ? 'cursor-pointer'
                  : !isFuture && canEdit
                    ? 'cursor-pointer hover:bg-muted'
                    : ''
              )}
              style={{
                backgroundColor: primaryMood ? `${primaryMood.mood_color}15` : undefined,
                borderColor: primaryMood ? primaryMood.mood_color : undefined,
              }}
              aria-label={
                isFuture
                  ? t('frontend.moods.calendar.future_date', { date: dateLabel })
                  : primaryMood
                    ? t('frontend.moods.calendar.mood_entry', {
                        date: dateLabel,
                        mood: t(`frontend.moods.levels.${primaryMood.mood_name}`),
                      })
                    : t('frontend.moods.calendar.no_entry', { date: dateLabel })
              }
            >
              {/* Day number */}
              <span className="text-[11px] sm:text-sm font-medium text-foreground leading-none">
                {day}
              </span>

              {/* Mood emoji if exists */}
              {primaryMood && (
                <span className="hidden sm:block text-2xl mt-0.5" aria-hidden="true">
                  {primaryMood.mood_emoji}
                </span>
              )}

              {/* Show user avatar for multi-user view */}
              {showUserAvatars && primaryMood?.user?.avatar_url && (
                <img
                  src={primaryMood.user.avatar_url}
                  alt={primaryMood.user.name || primaryMood.user.email}
                  referrerPolicy="no-referrer"
                  className="hidden sm:block absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-background shadow-md z-10"
                  onError={(e) => {
                    console.log('Avatar failed to load:', primaryMood.user.avatar_url)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}

              {/* Multiple moods indicator */}
              {hasMultipleMoods && (
                <div className="absolute top-0.5 right-0.5 h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
          )
        })}

        {/* Empty cells after last day */}
        {emptyEndCells.map((key) => (
          <div key={`${year}-${month}-${key}`} className="aspect-square" />
        ))}
      </div>
    </Card>
  )
}
