import { Fragment, memo } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { WeekData, WeekMoodData } from '@/types/ui'
import WeekSquare from './WeekSquare'

interface LifeGridProps {
  weeksData: WeekData[]
  moodData: Record<number, WeekMoodData>
  onWeekClick: (weekNumber: number) => void
}

function LifeGrid({ weeksData, moodData, onWeekClick }: LifeGridProps) {
  // Group weeks by year (80 rows of 52 weeks each)
  const weeksByYear = Array.from({ length: 80 }, (_, yearIndex) => {
    const startWeek = yearIndex * 52
    return weeksData.slice(startWeek, startWeek + 52)
  })

  return (
    <Card
      className="p-2 sm:p-4 lg:p-6 hover:translate-x-0 hover:translate-y-0 overflow-visible"
      id="life-grid"
    >
      {/* Container with CSS Grid for perfect alignment */}
      <div className="relative -mx-2 sm:mx-0">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden touch-pan-x snap-x snap-mandatory px-2">
          <div
            className="grid gap-1 sm:gap-2 py-1 min-w-[580px] sm:min-w-0"
            style={{ gridTemplateColumns: 'auto 1fr' }}
          >
            {/* Age header */}
            <div className="h-4 sm:h-6 text-[9px] sm:text-xs font-semibold text-muted-foreground flex items-center justify-center sticky left-0 z-20 bg-card pr-2">
              Age
            </div>

            {/* Week number headers (1-52) - hidden on mobile, show every 4th on tablet, all on desktop */}
            <div className="hidden sm:grid grid-cols-52 gap-0.75 sm:gap-1 lg:min-w-0 px-1 rounded-md">
              {Array.from({ length: 52 }, (_, i) => (
                <div
                  key={`week-header-${i + 1}`}
                  className={cn(
                    'text-center text-muted-foreground',
                    'sm:text-[8px] lg:text-[10px]',
                    // Show every 4th number on tablet, all on desktop
                    (i + 1) % 4 !== 0 && 'sm:invisible lg:visible'
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Year labels and week grid rows */}
            {weeksByYear.map((yearWeeks, yearIndex) => (
              <Fragment key={`year-${yearIndex.toString()}`}>
                {/* Age label for this row */}
                <div className="text-[8px] sm:text-[10px] text-muted-foreground flex items-center justify-end pr-1 sm:pr-2 sticky left-0 z-10 bg-card">
                  {yearIndex}
                </div>

                {/* Week row */}
                <div className="grid grid-cols-52 gap-[3px] sm:gap-1 min-w-[640px] sm:min-w-0 px-1 rounded-md snap-start">
                  {yearWeeks.map((week) => (
                    <WeekSquare
                      key={week.weekNumber}
                      week={week}
                      moodData={moodData[week.weekNumber]}
                      onClick={() => onWeekClick(week.weekNumber)}
                    />
                  ))}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

// Memo to prevent re-renders of the entire grid
export default memo(LifeGrid)
