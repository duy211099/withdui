import { router } from '@inertiajs/react'
import { Smile } from 'lucide-react'
import LocalTime from '@/components/LocalTime'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useI18n } from '@/contexts/I18nContext'
import { getFullDateTimeFormat, getLongDateFormat } from '@/lib/localTime'
import { cn } from '@/lib/utils'
import type { Mood, User } from '@/types'

interface MultiMoodModalProps {
  isOpen: boolean
  onClose: () => void
  moods: Mood[]
  current_user?: User | null
  canEdit?: boolean
}

export default function MultiMoodModal({
  isOpen,
  onClose,
  moods,
  current_user,
  canEdit = true,
}: MultiMoodModalProps) {
  const { t, locale } = useI18n()
  if (moods.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('frontend.moods.multi.title', { date: '' })}
            <LocalTime
              className="ml-1"
              dateTime={moods[0].entryDate}
              dateOnly
              format={getLongDateFormat(locale)}
            />
          </DialogTitle>
          <DialogDescription>
            {t('frontend.moods.multi.people_count', { count: moods.length })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {moods.map((mood) => {
            const isCurrentUser = current_user && mood.user.id === current_user.id

            return (
              <Card
                key={mood.id}
                className={cn(
                  'hover:translate-x-0 hover:translate-y-0',
                  isCurrentUser && 'ring-2 ring-primary ring-offset-2'
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* User Avatar */}
                    <div className="shrink-0">
                      {mood.user.avatarUrl ? (
                        <img
                          src={mood.user.avatarUrl}
                          referrerPolicy="no-referrer"
                          alt={mood.user.name || mood.user.email}
                          className="h-12 w-12 rounded-full border-2 border-border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                          <span className="text-lg font-semibold text-muted-foreground">
                            {(mood.user.name || mood.user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mood Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          {mood.user.name || mood.user.email}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs text-primary">
                              ({t('frontend.moods.multi.you')})
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{mood.moodEmoji}</span>
                        <div>
                          <p
                            className="text-sm font-medium capitalize"
                            style={{ color: mood.moodColor }}
                          >
                            {t(`frontend.moods.levels.${mood.moodName}`)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <LocalTime
                              dateTime={mood.createdAt}
                              format={getFullDateTimeFormat(locale)}
                            />
                          </p>
                        </div>
                      </div>

                      {mood.notes && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {mood.notes}
                        </p>
                      )}

                      {isCurrentUser && canEdit && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onClose()
                              router.visit(`/moods/${mood.id}/edit`)
                            }}
                          >
                            {t('frontend.moods.multi.edit_my_mood')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {/* Add your mood button if current user hasn't added one */}
          {current_user &&
            canEdit &&
            moods.length > 0 &&
            !moods.some((m) => m.user.id === current_user.id) && (
              <Card className="hover:translate-x-0 hover:translate-y-0 border-dashed border-2">
                <CardContent className="py-8 text-center">
                  <Smile className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('frontend.moods.multi.missing_mood')}
                  </p>
                  <Button
                    onClick={() => {
                      const date = moods[0].entryDate
                      onClose()
                      router.visit(`/moods/new?date=${date}`)
                    }}
                  >
                    {t('frontend.moods.multi.add_my_mood')}
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
