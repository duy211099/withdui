import { memo } from 'react'
import { Sparklines, SparklinesLine } from 'react-sparklines'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useI18n } from '@/contexts/I18nContext'
import { cn } from '@/lib/utils'
import type { WeekData, WeekMoodData } from '@/types/ui'

interface WeekSquareProps {
  week: WeekData
  moodData?: WeekMoodData
  onClick: () => void
}

function WeekSquare({ week, moodData, onClick }: WeekSquareProps) {
  const { t } = useI18n()

  // Calculate blended color (life stage + mood overlay)
  const backgroundColor = moodData
    ? blendColors(week.stageColor, getMoodColor(moodData.averageLevel), 0.7, 0.3)
    : week.stageColor

  // Opacity based on whether week is lived
  const opacity = week.isLived ? 1 : 0.2

  // Determine tooltip side based on week number (bottom 15 years = years 65-79)
  const yearIndex = Math.floor(week.weekNumber / 52)
  const tooltipSide = yearIndex >= 65 ? 'bottom' : 'top'

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            'group relative w-full aspect-square rounded-sm transition-all cursor-pointer overflow-visible',
            // Remove default focus outline, only show for keyboard nav
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            // Hover states
            'hover:ring-2 hover:ring-primary hover:ring-offset-0',
            'hover:scale-105 sm:hover:scale-110',
            // Flanking bars on hover
            'before:absolute before:top-[15%] before:bottom-[15%] before:left-0 before:w-[10%] before:bg-primary before:opacity-0 before:transition-opacity',
            'after:absolute after:top-[15%] after:bottom-[15%] after:right-0 after:w-[10%] after:bg-primary after:opacity-0 after:transition-opacity',
            'group-hover:before:opacity-100 group-hover:after:opacity-100',
            // Notes indicator
            week.hasNotes && 'ring-2 ring-offset-1 ring-yellow-500 shadow-[0_0_0_2px_#000000]'
          )}
          style={{
            backgroundColor,
            opacity,
          }}
          aria-label={`Week ${week.weekNumber}: ${week.dateRange.formatted}`}
        />
      </TooltipTrigger>

      <TooltipContent
        side={tooltipSide}
        align="center"
        className="hidden sm:block min-w-40 max-w-55 whitespace-nowrap"
      >
        {/* Week info */}
        <div className="text-xs space-y-0.5">
          <p className="font-semibold text-foreground">
            {t('frontend.life_weeks.tooltip.week')} {week.weekNumber}
          </p>
          <p className="text-muted-foreground text-[11px]">{week.dateRange.formatted}</p>
          <p className="text-muted-foreground text-[10px]">
            Year {week.year}, Week {week.weekOfYear}
          </p>
        </div>

        {/* Mood data if available */}
        {moodData && (
          <div className="mt-1.5 pt-1.5 border-t border-border">
            <p className="text-[11px] font-semibold mb-0.5 text-foreground">
              {t('frontend.life_weeks.tooltip.average_mood')}: {moodData.averageLevel.toFixed(1)}
            </p>

            {/* Mood sparkline */}
            {moodData.sparklineData.length > 0 && (
              <div className="h-6 w-full my-0.5">
                <Sparklines data={moodData.sparklineData} height={24}>
                  <SparklinesLine color="#22C55E" style={{ strokeWidth: 2 }} />
                </Sparklines>
              </div>
            )}

            <p className="text-[9px] text-muted-foreground">
              {moodData.count} {moodData.count === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        )}

        {/* Notes indicator */}
        {week.hasNotes && (
          <div className="mt-1.5 pt-1.5 border-t border-border">
            <p className="text-[11px] text-yellow-600 dark:text-yellow-400">
              📝 {t('frontend.life_weeks.tooltip.hasNotes')}
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

// Color blending function (mix two hex colors with weights)
function blendColors(color1: string, color2: string, weight1: number, weight2: number): string {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')

  const r1 = Number.parseInt(hex1.substring(0, 2), 16)
  const g1 = Number.parseInt(hex1.substring(2, 4), 16)
  const b1 = Number.parseInt(hex1.substring(4, 6), 16)

  const r2 = Number.parseInt(hex2.substring(0, 2), 16)
  const g2 = Number.parseInt(hex2.substring(2, 4), 16)
  const b2 = Number.parseInt(hex2.substring(4, 6), 16)

  const r = Math.round(r1 * weight1 + r2 * weight2)
  const g = Math.round(g1 * weight1 + g2 * weight2)
  const b = Math.round(b1 * weight1 + b2 * weight2)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Map mood level to color (matches Mood::MOOD_LEVELS)
function getMoodColor(averageLevel: number): string {
  const level = Math.round(averageLevel)
  const colors: Record<number, string> = {
    1: '#EF4444', // red-500
    2: '#F97316', // orange-500
    3: '#EAB308', // yellow-500
    4: '#84CC16', // lime-500
    5: '#22C55E', // green-500
  }
  return colors[level] || '#9CA3AF' // gray-400 fallback
}

// Memo to prevent re-renders
export default memo(WeekSquare)
