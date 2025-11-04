import { Head, usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'

interface User {
  id: number
  email: string
  name: string
  avatar_url?: string
}

interface PageProps extends InertiaPageProps {
  current_user: User | null
}

export default function Home() {
  const { current_user } = usePage<PageProps>().props
  const { t } = useTranslation()

  return (
    <>
      <Head title={t('frontend.home.title')} />
      <div className="min-h-screen bg-background">

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>{t('frontend.home.welcome')}</CardTitle>
              <CardDescription>
                {current_user
                  ? t('frontend.home.signed_in_as', { email: current_user.email })
                  : t('frontend.home.please_sign_in')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {current_user ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('frontend.home.success_message')}
                  </p>
                  <div className="grid gap-2">
                    <div>
                      <span className="font-semibold">{t('frontend.home.name_label')}</span> {current_user.name}
                    </div>
                    <div>
                      <span className="font-semibold">{t('frontend.home.email_label')}</span> {current_user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t('frontend.home.sign_in_instruction')}
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  )
}
