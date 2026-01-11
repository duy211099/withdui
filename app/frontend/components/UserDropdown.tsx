import axios from 'axios'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import useSWR from 'swr'
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
import { useDebounce } from '@/hooks/useDebounce'
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled || isLoading}
        >
          {isLoading ? (
            'Loading users...'
          ) : selectedUser ? (
            <div className="flex items-center gap-2 truncate">
              <span className="truncate">{selectedUser.name || selectedUser.email}</span>
              <span className="text-muted-foreground text-xs truncate">({selectedUser.email})</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search users by name or email..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {error ? 'Error loading users' : isLoading ? 'Loading...' : 'No user found.'}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setSearchQuery('')
                  }}
                >
                  <Check
                    className={cn('mr-2 h-4 w-4', value === user.id ? 'opacity-100' : 'opacity-0')}
                  />
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
      </PopoverContent>
    </Popover>
  )
}
