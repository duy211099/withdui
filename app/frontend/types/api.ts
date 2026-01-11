/**
 * API-related types
 * Generic types for API responses, pagination, and data fetching
 */

/**
 * Pagy pagination metadata
 * Returned by the backend with paginated API responses
 *
 * @see https://ddnexus.github.io/pagy/
 */
export interface PagyMetadata {
  /** Current page number */
  page: number
  /** Total number of pages */
  pages: number
  /** Total count of items */
  count: number
  /** Items per page */
  limit: number
  /** Next page number (null if on last page) */
  next: number | null
  /** Previous page number (null if on first page) */
  prev: number | null
  /** Starting index of items on current page */
  from: number
  /** Ending index of items on current page */
  to: number
}

/**
 * Generic paginated API response
 * Wraps data array with pagination metadata
 *
 * @template T - The type of items in the data array
 *
 * @example
 * ```typescript
 * // For users endpoint
 * type UsersResponse = PaginatedResponse<UserMinimal>
 * // Returns: { data: UserMinimal[], pagy: PagyMetadata }
 *
 * // For posts endpoint
 * type PostsResponse = PaginatedResponse<Post>
 * // Returns: { data: Post[], pagy: PagyMetadata }
 * ```
 */
export interface PaginatedResponse<T> {
  /** Array of data items */
  data: T[]
  /** Pagination metadata */
  pagy: PagyMetadata
}

/**
 * Generic API error response
 * Standard error structure from Rails API
 */
export interface ApiError {
  /** Error message */
  message: string
  /** Validation errors (field -> error message) */
  errors?: Record<string, string[]>
  /** HTTP status code */
  status?: number
}

/**
 * API request state for tracking loading/error states
 * Useful for managing UI feedback during API calls
 *
 * @template T - The type of data being fetched
 */
export interface ApiState<T> {
  /** The fetched data (null if not loaded) */
  data: T | null
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: ApiError | null
}
