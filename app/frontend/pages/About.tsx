import { Head } from '@inertiajs/react'
import { siFacebook, siGithub, siInstagram } from 'simple-icons/icons'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { useTranslation } from '@/contexts/I18nContext'

export default function About() {
  const { t } = useTranslation()
  const socials = [
    { name: 'GitHub', href: 'https://github.com/duy211099', icon: siGithub },
    { name: 'Facebook', href: 'https://www.facebook.com/dingudimaaa/', icon: siFacebook },
    { name: 'Instagram', href: 'https://www.instagram.com/duineeeeeee/', icon: siInstagram },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/duy211099/', icon: null },
  ]
  return (
    <>
      <Head title={t('frontend.about.title')} />
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-muted/50 blur-3xl" />

        <main className="container mx-auto px-4 py-12 sm:py-16 max-w-5xl relative">
          <div className="space-y-12">
            <header className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight font-serif">
                  {t('frontend.about.heading')}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
                  {t('frontend.about.subheading')}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/70 px-4 py-3 font-medium hover:bg-muted transition-colors"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {social.icon && (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          role="img"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <title>{social.name}</title>
                          <path d={social.icon?.path} fill="currentColor" />
                        </svg>
                      )}
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
              <Card className="hover:translate-x-0 hover:translate-y-0 border-2 border-border/70 bg-card/80 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.4)]">
                <CardContent className="space-y-3">
                  <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line leading-relaxed">
                    {t('frontend.about.poem_quote')}
                  </p>
                  <CardDescription className="text-right text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t('frontend.about.poem_author')}
                  </CardDescription>
                </CardContent>
              </Card>
            </header>
          </div>
        </main>
      </div>
    </>
  )
}
