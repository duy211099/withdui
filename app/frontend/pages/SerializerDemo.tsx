import { Head } from '@inertiajs/react'
import type { UserBasic, UserDetailed, UserMinimal } from '@/types'

interface SerializerDemoProps {
  inlineSerialized: UserBasic[]
  serializerBasic: UserBasic[]
  serializerDetailed: UserDetailed[]
  serializerMinimal: UserMinimal[]
  currentUserData: UserBasic
}

export default function SerializerDemo({
  inlineSerialized,
  serializerBasic,
  serializerDetailed,
  serializerMinimal,
  currentUserData,
}: SerializerDemoProps) {
  return (
    <>
      <Head title="Serializer Demo" />

      <h1 className="text-3xl font-bold mb-8">Serializer Demo: Different Approaches</h1>

      {/* Current User Card */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
          Current User (Serialized)
        </h2>
        <div className="flex items-center gap-4">
          {currentUserData.avatarUrl && (
            <img
              src={currentUserData.avatarUrl}
              alt={currentUserData.name || 'User avatar'}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{currentUserData.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentUserData.email}</p>
            <p className="text-xs text-gray-500">Role: {currentUserData.role}</p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approach 1: Inline */}
        <DataSection
          title="1. Inline Serialization"
          description="Controller method - Simple but repetitive"
          data={inlineSerialized}
          highlight="inline"
        />

        {/* Approach 2: Basic Serializer */}
        <DataSection
          title="2. UserSerializer (Basic)"
          description="Reusable class - Clean & DRY"
          data={serializerBasic}
          highlight="serializer"
        />

        {/* Approach 3: Detailed Serializer */}
        <DataSection
          title="3. UserSerializer (Detailed)"
          description="More fields for admin views"
          data={serializerDetailed}
          highlight="detailed"
        />

        {/* Approach 4: Minimal Serializer */}
        <DataSection
          title="4. UserSerializer (Minimal)"
          description="Lightweight for lists/dropdowns"
          data={serializerMinimal}
          highlight="minimal"
        />
      </div>

      {/* Code Comparison */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Why Use Serializers?</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Security:</strong> Prevents accidentally exposing sensitive fields (passwords,
              tokens)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>DRY:</strong> Reuse the same serialization logic across controllers
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Maintainability:</strong> Change JSON structure in one place
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Flexibility:</strong> Multiple serialization strategies (minimal, detailed)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>Testing:</strong> Easy to test serialization logic independently
            </span>
          </li>
        </ul>
      </div>
    </>
  )
}

// Helper component to display data sections
function DataSection({
  title,
  description,
  data,
  highlight,
}: {
  title: string
  description: string
  data: (UserBasic | UserDetailed | UserMinimal)[]
  highlight: 'inline' | 'serializer' | 'detailed' | 'minimal'
}) {
  const borderColor = {
    inline: 'border-gray-300 dark:border-gray-700',
    serializer: 'border-green-300 dark:border-green-700',
    detailed: 'border-purple-300 dark:border-purple-700',
    minimal: 'border-orange-300 dark:border-orange-700',
  }[highlight]

  return (
    <div className={`p-4 rounded-lg border-2 ${borderColor} bg-white dark:bg-gray-800`}>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>

      <div className="space-y-2">
        {data &&
          Array.isArray(data) &&
          data.slice(0, 2).map((user) => (
            <div key={user.id} className="p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
              <pre className="overflow-x-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          ))}
      </div>

      {data && data.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          Fields: {Object.keys(data[0] || {}).length} | Size: ~{JSON.stringify(data[0]).length}{' '}
          bytes/user
        </p>
      )}
    </div>
  )
}
