import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useI18n } from '@/contexts/I18nContext'
import type { LifeStageConfig, LifeWeekEntry, WeekData, WeekMoodData } from '@/types/ui'

interface WeekDetailModalProps {
  isOpen: boolean
  onClose: () => void
  weekNumber: number
  weekData?: WeekData
  moodData?: WeekMoodData
  weekEntry?: LifeWeekEntry
  lifeStage?: LifeStageConfig
  canEdit: boolean
}

export default function WeekDetailModal({
  isOpen,
  onClose,
  weekNumber,
  weekData,
  moodData,
  weekEntry,
  lifeStage,
  canEdit,
}: WeekDetailModalProps) {
  const { t } = useI18n()
  const [notes, setNotes] = useState(weekEntry?.notes || '')
  const [isSaving, setIsSaving] = useState(false)
  const hasWeekData = Boolean(weekData)

  const handleSave = async () => {
    if (!canEdit) return

    setIsSaving(true)

    try {
      const csrfToken = (
        document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
      )?.content

      const response = await fetch(`/life/weeks/${weekNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        },
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save notes (status ${response.status})`)
      }

      onClose()
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-1.5rem)] sm:w-auto sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('frontend.life_weeks.modal.title', { week: weekNumber })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Week info */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              {t('frontend.life_weeks.modal.week_info')}
            </h3>
            {hasWeekData ? (
              <div className="text-sm space-y-1">
                <p>{weekData?.dateRange.formatted}</p>
                <p>
                  Year {weekData?.year}, Week {weekData?.weekOfYear}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('frontend.life_weeks.modal.missing_week_data')}
              </p>
            )}
          </div>

          {/* Life stage */}
          {lifeStage && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                {t('frontend.life_weeks.modal.life_stage')}
              </h3>
              <div
                className="p-3 rounded-lg border-2"
                style={{
                  backgroundColor: `${lifeStage.color}20`,
                  borderColor: lifeStage.color,
                }}
              >
                <p className="font-medium">{lifeStage.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{lifeStage.description}</p>
              </div>
            </div>
          )}

          {/* Life stage missing */}
          {!lifeStage && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                {t('frontend.life_weeks.modal.life_stage')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('frontend.life_weeks.modal.missing_life_stage')}
              </p>
            </div>
          )}

          {/* Mood history */}
          {moodData && moodData.moodEntries.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                {t('frontend.life_weeks.modal.mood_history')}
              </h3>
              <div className="space-y-2">
                {moodData.moodEntries.map((entry, index) => (
                  <div
                    key={`${entry.date}-${index}`}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <span className="text-sm">{entry.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Level {entry.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes editor */}
          {canEdit && (
            <div>
              <Label htmlFor="notes">{t('frontend.life_weeks.modal.notes_label')}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('frontend.life_weeks.modal.notes_placeholder')}
                rows={6}
                className="mt-2"
              />
            </div>
          )}

          {/* Read-only notes */}
          {!canEdit && weekEntry?.notes && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                {t('frontend.life_weeks.modal.notes_label')}
              </h3>
              <p className="text-sm whitespace-pre-wrap">{weekEntry.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            {t('frontend.common.cancel')}
          </Button>
          {canEdit && (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? t('frontend.common.saving') : t('frontend.common.save')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
