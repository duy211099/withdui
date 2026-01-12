import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'
import type { LifeWeeksStatistics } from '@/types/ui'

interface LifeStatsCardsProps {
  statistics: LifeWeeksStatistics
}

export default function LifeStatsCards({ statistics }: LifeStatsCardsProps) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Weeks Lived */}
      <Card className="hover:translate-x-0 hover:translate-y-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('frontend.life_weeks.stats.weeksLived')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{statistics.weeksLived.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{statistics.ageInYears} years old</p>
        </CardContent>
      </Card>

      {/* Life Percentage */}
      <Card className="hover:translate-x-0 hover:translate-y-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('frontend.life_weeks.stats.lifePercentage')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{statistics.lifePercentage.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('frontend.life_weeks.stats.of_80_years')}
          </p>
        </CardContent>
      </Card>

      {/* Peak Weeks Remaining */}
      <Card className="hover:translate-x-0 hover:translate-y-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('frontend.life_weeks.stats.peak_weeks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{statistics.peakWeeksRemaining.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">{statistics.peakAgeRange} years</p>
        </CardContent>
      </Card>

      {/* Total Remaining */}
      <Card className="hover:translate-x-0 hover:translate-y-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t('frontend.life_weeks.stats.weeksRemaining')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{statistics.weeksRemaining.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('frontend.life_weeks.stats.until_80')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
