import { Head, router, usePage } from '@inertiajs/react'
import { Calendar, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/contexts/I18nContext'
import type { BasePageProps, User } from '@/types'

interface ProfilePageProps extends BasePageProps {
  user: User
}

export default function Profile({ user }: ProfilePageProps) {
  const { t } = useI18n()
  const page = usePage<BasePageProps>()
  const flash = page.props.flash as { notice?: string; alert?: string } | undefined
  const [name, setName] = useState(user.name || '')
  const [birthDate, setBirthDate] = useState(user.birthDate || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    router.patch(
      '/profile',
      {
        user: {
          name,
          birth_date: birthDate,
        },
      },
      {
        onFinish: () => {
          setIsSaving(false)
        },
      }
    )
  }

  return (
    <>
      <Head title={t('frontend.profile.title')} />

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">{t('frontend.profile.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('frontend.profile.subtitle')}</p>
          </div>
        </div>

        {/* Flash messages */}
        {flash?.notice && (
          <Card className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
            <CardContent className="pt-6">
              <p className="text-sm text-green-800 dark:text-green-200">{flash.notice}</p>
            </CardContent>
          </Card>
        )}

        {flash?.alert && (
          <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-sm text-red-800 dark:text-red-200">{flash.alert}</p>
            </CardContent>
          </Card>
        )}

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('frontend.profile.form.title')}</CardTitle>
            <CardDescription>{t('frontend.profile.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Display */}
              {user.avatarUrl && (
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatarUrl}
                    alt={user.name || user.email}
                    className="h-20 w-20 rounded-full ring-2 ring-border"
                  />
                  <div>
                    <p className="text-sm font-medium">{t('frontend.profile.form.avatar')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('frontend.profile.form.avatar_description')}
                    </p>
                  </div>
                </div>
              )}

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('frontend.profile.form.email')}</Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  {t('frontend.profile.form.email_readonly')}
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('frontend.profile.form.name')}</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('frontend.profile.form.name_placeholder')}
                />
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birth_date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('frontend.profile.form.birth_date')}
                </Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  {t('frontend.profile.form.birth_date_description')}
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? t('frontend.common.saving') : t('frontend.common.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        {birthDate && (
          <Card className="mt-6 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {t('frontend.profile.info.birth_date_set')}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {t('frontend.profile.info.life_weeks_ready')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
