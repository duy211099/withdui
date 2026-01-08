/**
 * TypedSerializerExamples.tsx
 *
 * This file demonstrates best practices for using TypeScript types
 * with Rails serializers in Inertia.js pages.
 *
 * KEY PRINCIPLE: Your TypeScript types should mirror your Rails serializers
 */

import type { UserBasic, UserDetailed, UserMinimal } from '@/types'

// ============================================================================
// Example 1: Simple User Profile Page
// ============================================================================

interface UserProfileProps {
  user: UserBasic // ✅ Use UserBasic for most profile views
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      {/* TypeScript will autocomplete all available fields! */}
    </div>
  )
}

// Rails Controller:
// render inertia: 'UserProfile', props: {
//   user: UserSerializer.new(@user).as_json
// }

// ============================================================================
// Example 2: Admin Dashboard with Detailed Info
// ============================================================================

interface AdminDashboardProps {
  users: UserDetailed[] // ✅ Use UserDetailed for admin views
  current_user: UserBasic
}

export function AdminDashboard({ users, current_user }: AdminDashboardProps) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Logged in as: {current_user.name}</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Provider</th>
            <th>UID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {/* TypeScript knows these fields exist in UserDetailed */}
              <td>{user.provider || 'local'}</td>
              <td>{user.uid || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Rails Controller:
// render inertia: 'AdminDashboard', props: {
//   users: User.all.map { |u| UserSerializer.new(u).as_detailed_json },
//   current_user: UserSerializer.new(current_user).as_json
// }

// ============================================================================
// Example 3: Performance-Optimized User List (Minimal Data)
// ============================================================================

interface UserListProps {
  users: UserMinimal[] // ✅ Use UserMinimal for large lists
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-2">
          {user.avatar_url && (
            <img src={user.avatar_url} alt={user.name || 'User'} className="w-8 h-8 rounded-full" />
          )}
          <span>{user.name}</span>
          {/* TypeScript will ERROR if you try to access user.email */}
          {/* This prevents bugs! UserMinimal doesn't include email */}
        </div>
      ))}
    </div>
  )
}

// Rails Controller:
// render inertia: 'UserList', props: {
//   users: User.all.map { |u| UserSerializer.new(u).as_minimal_json }
// }

// ============================================================================
// Example 4: Type Guards for Conditional Rendering
// ============================================================================

// Type guard to check if user has detailed info
function isUserDetailed(user: UserBasic | UserDetailed): user is UserDetailed {
  return 'provider' in user
}

interface FlexibleUserCardProps {
  user: UserBasic | UserDetailed
}

export function FlexibleUserCard({ user }: FlexibleUserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>

      {/* Conditionally show OAuth info if available */}
      {isUserDetailed(user) && user.provider && (
        <p className="text-sm text-gray-500">Signed in with {user.provider}</p>
      )}
    </div>
  )
}

// ============================================================================
// Example 5: Reusable Components with Generic Types
// ============================================================================

interface UserAvatarProps<T extends UserMinimal> {
  user: T // ✅ Generic type accepts any user type with at least avatar_url
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar<T extends UserMinimal>({ user, size = 'md' }: UserAvatarProps<T>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return user.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={user.name || 'User'}
      className={`${sizeClasses[size]} rounded-full`}
    />
  ) : (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center`}
    >
      {user.name?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

// ✅ This component works with UserMinimal, UserBasic, AND UserDetailed!
// <UserAvatar user={minimalUser} />
// <UserAvatar user={basicUser} />
// <UserAvatar user={detailedUser} />

// ============================================================================
// Best Practices Summary
// ============================================================================

/**
 * 1. MATCH SERIALIZERS TO TYPES
 *    - UserSerializer#as_json → UserBasic
 *    - UserSerializer#as_detailed_json → UserDetailed
 *    - UserSerializer#as_minimal_json → UserMinimal
 *
 * 2. USE THE RIGHT TYPE FOR THE JOB
 *    - Lists/dropdowns → UserMinimal (performance)
 *    - Profiles/cards → UserBasic (standard)
 *    - Admin/settings → UserDetailed (complete info)
 *
 * 3. UPDATE BOTH SIDES TOGETHER
 *    - Add field to serializer → Add to TypeScript type
 *    - Remove field from serializer → Remove from TypeScript type
 *    - TypeScript will catch mismatches at compile time!
 *
 * 4. USE TYPE EXPORTS FROM @/types
 *    import type { UserBasic, UserDetailed, UserMinimal } from '@/types'
 *
 * 5. AVOID INLINE TYPES
 *    ❌ Don't: interface Props { user: { id: string, name: string } }
 *    ✅ Do: interface Props { user: UserBasic }
 */
