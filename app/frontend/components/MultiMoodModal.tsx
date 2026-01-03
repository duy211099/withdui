import { router } from '@inertiajs/react'
import { Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  if (moods.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {`Moods for ${new Date(moods[0].entry_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}`}
          </DialogTitle>
          <DialogDescription>
            {moods.length} {moods.length === 1 ? 'person' : 'people'} recorded their mood on this
            day
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {moods.map((mood) => {
            const isCurrentUser = current_user && mood.user.id === current_user.id

            return (
              <Card
                key={mood.id}
                className={`hover:translate-x-0 hover:translate-y-0 ${
                  isCurrentUser ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="shrink-0">
                      {mood.user.avatar_url ? (
                        <img
                          src={mood.user.avatar_url}
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
                            <span className="ml-2 text-xs text-primary">(You)</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{mood.mood_emoji}</span>
                        <div>
                          <p
                            className="text-sm font-medium capitalize"
                            style={{ color: mood.mood_color }}
                          >
                            {mood.mood_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(mood.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
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
                            Edit My Mood
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
                    You haven't recorded your mood for this day yet
                  </p>
                  <Button
                    onClick={() => {
                      const date = moods[0].entry_date
                      onClose()
                      router.visit(`/moods/new?date=${date}`)
                    }}
                  >
                    Add My Mood
                  </Button>
                </CardContent>
              </Card>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
