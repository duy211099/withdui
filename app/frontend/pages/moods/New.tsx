import { Head, Link, useForm } from '@inertiajs/react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/contexts/I18nContext'
import { moods_path } from '@/lib/routes'
import { cn, formatDate, isDateStringInFuture } from '@/lib/utils'
import type { MoodLevels } from '@/types'

interface NewProps {
  date: string
  mood_levels: MoodLevels
}

export default function New({ date, mood_levels }: NewProps) {
  const { t, locale } = useI18n()
  const { data, setData, post, processing, errors } = useForm({
    level: null as number | null,
    entry_date: date,
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (data.level === null) {
      alert(t('frontend.moods.form.select_level'))
      return
    }

    // Validate date is not in the future
    if (isDateStringInFuture(data.entry_date)) {
      alert(t('frontend.moods.form.future_date_record'))
      return
    }

    post(moods_path())
  }

  return (
    <>
      <Head title={t('frontend.moods.new.title')} />

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-2xl">
        <Link href={moods_path()}>
          <Button variant="ghost" className="mb-4">
            {t('frontend.moods.shared.back_to_calendar')}
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t('frontend.moods.new.heading')}</h1>
        </div>

        <Card className="hover:translate-x-0 hover:translate-y-0">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">
              {formatDate(date, undefined, locale)}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mood Level Selector */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t('frontend.moods.form.how_feeling')}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                  {Object.entries(mood_levels).map(([level, config]) => {
                    const levelNum = parseInt(level, 10)
                    const isSelected = data.level === levelNum

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setData('level', levelNum)}
                        className={cn(
                          'flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2',
                          'transition-all hover:shadow-lg',
                          isSelected
                            ? 'shadow-lg ring-2 ring-offset-1'
                            : 'border-border hover:border-primary'
                        )}
                        style={
                          {
                            backgroundColor: isSelected ? `${config.color}25` : `${config.color}10`,
                            borderColor: isSelected ? config.color : undefined,
                            '--tw-ring-color': isSelected ? config.color : undefined,
                          } as React.CSSProperties
                        }
                        aria-label={t('frontend.moods.form.select_mood', {
                          mood: t(`frontend.moods.levels.${config.name}`),
                        })}
                        aria-pressed={isSelected}
                      >
                        <span className="text-3xl sm:text-4xl">{config.emoji}</span>
                        <span className="text-xs sm:text-sm font-medium capitalize">
                          {t(`frontend.moods.levels.${config.name}`)}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {errors.level && <p className="text-destructive text-sm">{errors.level}</p>}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-base font-semibold">
                  {t('frontend.moods.form.notes_label')}
                </Label>
                <Textarea
                  id="notes"
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  rows={6}
                  placeholder={t('frontend.moods.form.notes_placeholder')}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  {t('frontend.moods.form.character_count', { count: data.notes.length })}
                </p>
                {errors.notes && <p className="text-destructive text-sm">{errors.notes}</p>}
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={processing || data.level === null}
                  size="lg"
                  className="flex-1"
                >
                  {processing
                    ? t('frontend.moods.form.saving')
                    : t('frontend.moods.form.save_mood')}
                </Button>
                <Link href={moods_path()}>
                  <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('frontend.moods.shared.cancel')}
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Helpful tip */}
        <Card className="mt-4">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('frontend.moods.new.tip')}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
