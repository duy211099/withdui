import LocalTime from '@/components/LocalTime'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useI18n } from '@/contexts/I18nContext'
import { getFullDateTimeFormat, getLongDateFormat } from '@/lib/localTime'
import type { Mood } from '@/types'

type MoodDetail = Omit<Mood, 'updated_at'>

interface MoodDetailModalProps {
  mood: MoodDetail | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (moodId: number) => void
  canEdit: boolean
}

export default function MoodDetailModal({
  mood,
  isOpen,
  onClose,
  onEdit,
  canEdit,
}: MoodDetailModalProps) {
  const { t, locale } = useI18n()
  if (!mood) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span
              className="text-4xl p-2 rounded-lg"
              style={{ backgroundColor: `${mood.mood_color}20` }}
            >
              {mood.mood_emoji}
            </span>
            <div>
              <div className="capitalize text-xl">
                {t(`frontend.moods.levels.${mood.mood_name}`)}
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                <LocalTime dateTime={mood.entry_date} dateOnly format={getLongDateFormat(locale)} />
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* User Info */}
        <div className="flex items-center gap-2 py-2 border-y">
          {mood.user.avatar_url && (
            <img
              src={mood.user.avatar_url}
              alt={mood.user.name || mood.user.email}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full"
            />
          )}
          <div>
            <div className="text-sm font-medium">{mood.user.name || mood.user.email}</div>
            <div className="text-xs text-muted-foreground">
              {t('frontend.moods.detail.recorded_on', { date: '' })}
              <LocalTime
                className="ml-1"
                dateTime={mood.created_at}
                format={getFullDateTimeFormat(locale)}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        {mood.notes && (
          <div className="py-4">
            <DialogDescription className="text-base whitespace-pre-wrap">
              {mood.notes}
            </DialogDescription>
          </div>
        )}

        {!mood.notes && (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              {t('frontend.moods.detail.no_notes')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
          {canEdit && onEdit && (
            <Button variant="default" onClick={() => onEdit(mood.id)}>
              {t('frontend.moods.detail.edit_entry')}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            {t('frontend.moods.shared.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
