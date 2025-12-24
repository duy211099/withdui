import type * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-muted-foreground focus-visible:border-primary aria-invalid:border-destructive flex field-sizing-content min-h-20 w-full rounded-md border-2 border-border bg-transparent px-3.5 py-2.5 text-base transition-[border-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-primary/30 aria-invalid:ring-2 aria-invalid:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
