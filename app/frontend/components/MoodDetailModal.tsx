import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  if (!mood) return null

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span
              className="text-4xl p-2 rounded-lg"
              style={{ backgroundColor: `${mood.mood_color}20` }}
            >
              {mood.mood_emoji}
            </span>
            <div>
              <div className="capitalize text-xl">{mood.mood_name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {formatDate(mood.entry_date)}
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
              Recorded on {formatTimestamp(mood.created_at)}
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
            <p className="text-sm text-muted-foreground italic">No notes for this entry</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-2">
          {canEdit && onEdit && (
            <Button variant="default" onClick={() => onEdit(mood.id)}>
              Edit Entry
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
