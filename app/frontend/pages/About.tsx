import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'

export default function About() {
  const { t } = useTranslation()
  const contactEmail = t('frontend.about.contact_email_value')
  const contactSocial = t('frontend.about.contact_social_value')

  return (
    <>
      <Head title={t('frontend.about.title')} />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-10 max-w-5xl">
          <div className="space-y-10">
            <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {t('frontend.about.hero_note')}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold">{t('frontend.about.heading')}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  {t('frontend.about.subheading')}
                </p>
              </div>
              <Card className="hover:translate-x-0 hover:translate-y-0">
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t('frontend.about.poem_quote')}
                  </p>
                  <CardDescription>- {t('frontend.about.poem_author')}</CardDescription>
                </CardContent>
              </Card>
            </header>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="hover:translate-x-0 hover:translate-y-0">
                <CardHeader>
                  <CardTitle>{t('frontend.about.contact_title')}</CardTitle>
                  <CardDescription>{t('frontend.about.contact_body')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t('frontend.about.contact_email_label')}
                    </span>
                    <span className="font-medium">{contactEmail}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t('frontend.about.contact_social_label')}
                    </span>
                    <span className="font-medium">{contactSocial}</span>
                  </div>
                </CardContent>
              </Card>

              <section className="border-2 border-border rounded-lg bg-card p-6 md:p-8 flex flex-col gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{t('frontend.about.cta_title')}</h2>
                  <p className="text-muted-foreground">{t('frontend.about.cta_body')}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href={`mailto:${contactEmail}`}>{t('frontend.about.cta_primary')}</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/blog">{t('frontend.about.cta_secondary')}</Link>
                  </Button>
                </div>
              </section>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
