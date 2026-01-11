import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DropdownProps {
  value?: string
  onValueChange: (value: string) => void
  options: string[]
  disabled?: boolean
  placeholder?: string
  searchPlaceholder?: string
  className?: string
}

export function Dropdown({
  value,
  onValueChange,
  options,
  disabled = false,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options

    const query = searchQuery.toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(query))
  }, [options, searchQuery])

  // Find selected option
  const selectedOption = options.find((option) => option === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between border shadow-none hover:shadow-none', className)}
          disabled={disabled}
        >
          {selectedOption || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
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
      </PopoverContent>
    </Popover>
  )
}
