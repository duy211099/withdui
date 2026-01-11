import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import useSWR from 'swr'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { useDebounce } from '@/hooks/useDebounce'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import type { PaginatedResponse, UserMinimal } from '@/types'

interface UserDropdownProps {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

// Fetcher function for SWR - fetches users from the API with search
const fetcher = async (url: string): Promise<PaginatedResponse<UserMinimal>> => {
  const response = await axios.get<PaginatedResponse<UserMinimal>>(url)
  return response.data
}

export function UserDropdown({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Select user...',
  className,
}: UserDropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const isMobile = useIsMobile()

  // Debounce search query (300ms delay)
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Build API URL with search query
  const apiUrl = React.useMemo(() => {
    const url = new URL('/api/users', window.location.origin)
    if (debouncedQuery) {
      url.searchParams.set('q', debouncedQuery)
    }
    return url.pathname + url.search
  }, [debouncedQuery])

  // Fetch users with SWR (server-side search)
  const { data, isLoading, error } = useSWR<PaginatedResponse<UserMinimal>>(apiUrl, fetcher)

  const users = data?.data || []
  const pagy = data?.pagy

  // Find selected user (may need to fetch if not in current page)
  const selectedUser = users.find((user) => user.id === value)

  const triggerButton = (
    <Button
      variant="outline"
      type="button"
      role="combobox"
      aria-expanded={open}
      className={cn(
        'w-full justify-between border shadow-none hover:shadow-none text-left truncate',
        className
      )}
      disabled={disabled || isLoading}
      onClick={isMobile ? () => setOpen(true) : undefined}
    >
      {isLoading ? (
        'Loading users...'
      ) : selectedUser ? (
        <div className="flex items-center gap-2 truncate">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={selectedUser.avatarUrl || undefined}
              alt={selectedUser.name || selectedUser.email}
            />
            <AvatarFallback className="text-xs">
              {(selectedUser.name?.[0] || selectedUser.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate">{selectedUser.name || selectedUser.email}</span>
          <span className="text-muted-foreground text-xs truncate">({selectedUser.email})</span>
        </div>
      ) : (
        placeholder
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )

  const commandContent = (
    <Command
      shouldFilter={false}
      className="rounded-lg shadow-none **:[[cmdk-item]]:px-3 **:[[cmdk-item]]:py-2.5 **:[[cmdk-item]]:text-sm"
    >
      <CommandInput
        placeholder="Search users by name or email..."
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="text-base sm:text-sm"
      />
      <CommandList className="max-h-[55vh] sm:max-h-[320px]">
        <CommandEmpty>
          {error ? 'Error loading users' : isLoading ? 'Loading...' : 'No user found.'}
        </CommandEmpty>
        <CommandGroup className="p-1 sm:p-1.5">
          {users.map((user) => (
            <CommandItem
              key={user.id}
              value={user.id}
              className="items-start gap-3 sm:gap-2"
              onSelect={(currentValue) => {
                onValueChange(currentValue === value ? '' : currentValue)
                setOpen(false)
                setSearchQuery('')
              }}
            >
              <Check
                className={cn('mt-0.5 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
              />
              <Avatar className="h-9 w-9 sm:h-8 sm:w-8 mt-0.5">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name || user.email} />
                <AvatarFallback className="text-sm">
                  {(user.name?.[0] || user.email[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-medium truncate">{user.name || 'No name'}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        {pagy && pagy.count > 0 && (
          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            Showing {pagy.from}-{pagy.to} of {pagy.count} users
            {pagy.pages > 1 && ` (page ${pagy.page} of ${pagy.pages})`}
          </div>
        )}
      </CommandList>
    </Command>
  )

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <CommandDialog open={open} onOpenChange={setOpen} title="Select user">
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
        sideOffset={8}
        className="w-[min(520px,calc(100vw-1.5rem))] max-h-[70vh] overflow-hidden p-0 shadow-xl"
      >
        {commandContent}
      </PopoverContent>
    </Popover>
  )
}
