import { Head } from '@inertiajs/react'
import { Calendar, Download } from 'lucide-react'
import { useState } from 'react'
import LifeGrid from '@/components/life/LifeGrid'
import LifeStatsCards from '@/components/life/LifeStatsCards'
import LifeWeeksFacts from '@/components/life/LifeWeeksFacts'
import WeekDetailModal from '@/components/life/WeekDetailModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import type { BasePageProps } from '@/types'
import type { LifeWeekEntry, LifeWeeksData } from '@/types/ui'

interface WeeksPageProps extends BasePageProps {
  lifeWeeksData: LifeWeeksData
  weekEntries: LifeWeekEntry[]
  canEdit: boolean
}

export default function Weeks({ lifeWeeksData, weekEntries, canEdit }: WeeksPageProps) {
  const { t } = useI18n()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Index week entries by week number for fast lookup
  const weekEntriesMap =
    weekEntries?.reduce(
      (acc, entry) => {
        acc[entry.weekNumber] = entry
        return acc
      },
      {} as Record<number, LifeWeekEntry>
    ) || {}

  // Handle week click
  const handleWeekClick = (weekNumber: number) => {
    setSelectedWeek(weekNumber)
    setIsModalOpen(true)
  }

  // Handle export as PNG
  const handleExport = async () => {
    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default

    const gridElement = document.getElementById('life-grid')
    if (!gridElement) return

    try {
      const canvas = await html2canvas(gridElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
      })

      // Download as PNG
      const link = document.createElement('a')
      link.download = `life-in-weeks-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <>
      <Head title={t('frontend.life_weeks.title')} />

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Calendar className="h-8 w-8 text-primary" />
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                {t('frontend.life_weeks.title')}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('frontend.life_weeks.subtitle')}
              </p>
            </div>
          </div>

          <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            {t('frontend.life_weeks.export_png')}
          </Button>
        </div>

        {/* Statistics Cards */}
        <LifeStatsCards statistics={lifeWeeksData.statistics} />

        {/* Life Stages Legend */}
        <Card className="mb-6 hover:translate-x-0 hover:translate-y-0">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center sm:text-left">
              {t('frontend.life_weeks.legend.title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {Object.entries(lifeWeeksData.lifeStages).map(([key, stage]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-lg border-2"
                  style={{
                    backgroundColor: `${stage.color}20`,
                    borderColor: stage.color,
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{stage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.ageRange.min}-{stage.ageRange.max} years
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Life Grid */}
        <LifeGrid
          weeksData={lifeWeeksData.weeks}
          moodData={lifeWeeksData.moodData}
          onWeekClick={handleWeekClick}
        />

        {/* Info Card */}
        <Card className="mt-6 hover:translate-x-0 hover:translate-y-0">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              {t('frontend.life_weeks.info.description')}
            </p>
          </CardContent>
        </Card>

        {/* Scientific Facts */}
        <div className="mt-6">
          <LifeWeeksFacts />
        </div>
      </div>

      {/* Week Detail Modal */}
      {selectedWeek !== null && (
        <WeekDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          weekNumber={selectedWeek}
          weekData={lifeWeeksData.weeks[selectedWeek]}
          moodData={lifeWeeksData.moodData[selectedWeek]}
          weekEntry={weekEntriesMap[selectedWeek]}
          lifeStage={
            lifeWeeksData.weeks[selectedWeek]?.lifeStage
              ? lifeWeeksData.lifeStages[lifeWeeksData.weeks[selectedWeek].lifeStage]
              : undefined
          }
          canEdit={canEdit}
        />
      )}
    </>
  )
}
