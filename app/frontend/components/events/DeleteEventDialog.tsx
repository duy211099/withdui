import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useI18n } from '@/contexts/I18nContext'
import { event_path } from '@/lib/routes'
import type { Event } from '@/types'

interface DeleteEventDialogProps {
  event: Event
}

export default function DeleteEventDialog({ event }: DeleteEventDialogProps) {
  const { t } = useI18n()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">{t('frontend.events.delete.trigger')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('frontend.events.delete.title')}</DialogTitle>
          <DialogDescription>{t('frontend.events.delete.description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('frontend.events.delete.cancel')}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => router.delete(event_path(event.id))}>
              {t('frontend.events.delete.confirm')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
