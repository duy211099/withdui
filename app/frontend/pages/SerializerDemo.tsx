import { Head } from '@inertiajs/react'
import { useTranslation } from '@/contexts/I18nContext'
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
  const { t } = useTranslation()
  return (
    <>
      <Head title={t('frontend.serializer_demo.title')} />

      <h1 className="text-3xl font-bold mb-8">{t('frontend.serializer_demo.heading')}</h1>

      {/* Current User Card */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
          {t('frontend.serializer_demo.current_user')}
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
            <p className="text-xs text-gray-500">
              {t('frontend.serializer_demo.role', { role: currentUserData.role })}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approach 1: Inline */}
        <DataSection
          title={t('frontend.serializer_demo.inline.title')}
          description={t('frontend.serializer_demo.inline.description')}
          data={inlineSerialized}
          highlight="inline"
        />

        {/* Approach 2: Basic Serializer */}
        <DataSection
          title={t('frontend.serializer_demo.basic.title')}
          description={t('frontend.serializer_demo.basic.description')}
          data={serializerBasic}
          highlight="serializer"
        />

        {/* Approach 3: Detailed Serializer */}
        <DataSection
          title={t('frontend.serializer_demo.detailed.title')}
          description={t('frontend.serializer_demo.detailed.description')}
          data={serializerDetailed}
          highlight="detailed"
        />

        {/* Approach 4: Minimal Serializer */}
        <DataSection
          title={t('frontend.serializer_demo.minimal.title')}
          description={t('frontend.serializer_demo.minimal.description')}
          data={serializerMinimal}
          highlight="minimal"
        />
      </div>

      {/* Code Comparison */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {t('frontend.serializer_demo.why_serializers.title')}
        </h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>{t('frontend.serializer_demo.why_serializers.security.title')}</strong>{' '}
              {t('frontend.serializer_demo.why_serializers.security.body')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>{t('frontend.serializer_demo.why_serializers.dry.title')}</strong>{' '}
              {t('frontend.serializer_demo.why_serializers.dry.body')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>{t('frontend.serializer_demo.why_serializers.maintainability.title')}</strong>{' '}
              {t('frontend.serializer_demo.why_serializers.maintainability.body')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>{t('frontend.serializer_demo.why_serializers.flexibility.title')}</strong>{' '}
              {t('frontend.serializer_demo.why_serializers.flexibility.body')}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">✓</span>
            <span>
              <strong>{t('frontend.serializer_demo.why_serializers.testing.title')}</strong>{' '}
              {t('frontend.serializer_demo.why_serializers.testing.body')}
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
