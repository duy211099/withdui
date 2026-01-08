import type { ReactNode } from 'react'
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

interface DeleteDialogProps {
  title: string
  description?: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  confirmDisabled?: boolean
}

export default function DeleteDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  trigger,
  open,
  onOpenChange,
  confirmDisabled,
}: DeleteDialogProps) {
  const dialogProps = typeof open === 'boolean' ? { open, onOpenChange } : {}

  return (
    <Dialog {...dialogProps}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm} disabled={confirmDisabled}>
              {confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
