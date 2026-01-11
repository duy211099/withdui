/**
 * API utility functions and helpers
 * Centralized API request handling with type safety
 */

import axios, { type AxiosResponse } from 'axios'
import type { PaginatedResponse } from '@/types'

/**
 * Generic fetcher for SWR with paginated endpoints
 * Automatically handles pagination response structure
 *
 * @template T - The type of items in the paginated response
 * @param url - The API endpoint URL
 * @returns Promise resolving to paginated data
 *
 * @example
 * ```typescript
 * import useSWR from 'swr'
 * import { paginatedFetcher } from '@/lib/api'
 * import type { UserMinimal } from '@/types'
 *
 * // In your component
 * const { data } = useSWR<PaginatedResponse<UserMinimal>>(
 *   '/api/users',
 *   paginatedFetcher
 * )
 *
 * const users = data?.data || []
 * const pagy = data?.pagy
 * ```
 */
export async function paginatedFetcher<T>(url: string): Promise<PaginatedResponse<T>> {
  const response: AxiosResponse<PaginatedResponse<T>> = await axios.get(url)
  return response.data
}

/**
 * Build API URL with query parameters
 * Helper for constructing URLs with search, filters, and pagination
 *
 * @param path - Base API path (e.g., '/api/users')
 * @param params - Query parameters as key-value pairs
 * @returns Complete URL with query string
 *
 * @example
 * ```typescript
 * const url = buildApiUrl('/api/users', {
 *   q: 'john',
 *   page: 2,
 *   limit: 25
 * })
 * // Returns: '/api/users?q=john&page=2&limit=25'
 * ```
 */
export function buildApiUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(path, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.pathname + url.search
}
