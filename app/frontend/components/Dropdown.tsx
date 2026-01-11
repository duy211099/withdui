import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'

interface DropdownProps {
  value?: string
  onValueChange: (value: string) => void
  options: string[]
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  className?: string
  dialogTitle?: string
}

export function Dropdown({
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  dialogTitle = 'Select option',
  className,
}: DropdownProps) {
  const listId = React.useId()
  const triggerLabelId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const isMobile = useIsMobile()

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) return []
    if (!searchQuery) return options

    const query = searchQuery.toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(query))
  }, [options, searchQuery])

  // Find selected option
  const selectedOption = options?.find((option) => option === value)

  const commandContent = (
    <Command shouldFilter={false} className="rounded-lg shadow-none">
      <CommandInput
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList id={listId} className="max-h-[60vh] sm:max-h-[60vh]">
        <CommandEmpty>No option found.</CommandEmpty>
        <CommandGroup>
          {filteredOptions.map((option) => (
            <CommandItem
              key={option}
              value={option}
              onSelect={(currentValue) => {
                onValueChange(currentValue === value ? '' : currentValue)
                setOpen(false)
                setSearchQuery('')
              }}
            >
              <Check
                className={cn('mr-2 h-4 w-4', value === option ? 'opacity-100' : 'opacity-0')}
              />
              {option}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  const triggerButton = (
    <Button
      variant="outline"
      type="button"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-labelledby={triggerLabelId}
      className={cn(
        'w-full justify-between border shadow-none hover:shadow-none text-left truncate',
        className
      )}
      disabled={disabled}
      onClick={isMobile ? () => setOpen(true) : undefined}
    >
      <span id={triggerLabelId}>{selectedOption || placeholder}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title={dialogTitle}
          contentClassName="h-[80vh]"
        >
          {commandContent}
        </CommandDialog>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[calc(100vw-2rem)] max-h-[60vh] overflow-auto p-0 sm:w-72"
      >
        {commandContent}
      </PopoverContent>
    </Popover>
  )
}
