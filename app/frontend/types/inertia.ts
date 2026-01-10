import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import type { User } from './serializers'

/**
 * Inertia.js specific types
 */

/**
 * Base page props that extend Inertia's PageProps
 * All Inertia pages should extend this for consistent current_user access
 */
export interface BasePageProps extends InertiaPageProps {
  current_user?: User | null
}

/**
 * Re-export Inertia types for convenience
 */
export type { InertiaPageProps }
