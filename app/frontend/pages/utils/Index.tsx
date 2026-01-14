import { Head, Link } from '@inertiajs/react'
import { Calendar, Clock, Gift } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface UtilityCard {
  title: string
  description: string
  icon: ReactNode
  href: string
  available: boolean
  accent: 'primary' | 'blue' | 'emerald'
}

const ACCENT_STYLES: Record<
  UtilityCard['accent'],
  { glow: string; icon: string; pill: string; border: string }
> = {
  primary: {
    glow: 'from-primary/15 via-accent/10 to-primary/5',
    icon: 'border-primary bg-primary/10 text-primary',
    pill: 'bg-primary/10 text-primary',
    border: 'border-primary/50',
  },
  blue: {
    glow: 'from-blue-400/20 via-cyan-300/15 to-blue-500/10',
    icon: 'border-blue-500 bg-blue-500/10 text-blue-700',
    pill: 'bg-blue-500/10 text-blue-700',
    border: 'border-blue-500/50',
  },
  emerald: {
    glow: 'from-emerald-400/20 via-emerald-300/15 to-green-500/10',
    icon: 'border-emerald-500 bg-emerald-500/10 text-emerald-700',
    pill: 'bg-emerald-500/10 text-emerald-700',
    border: 'border-emerald-500/50',
  },
}

export default function Index() {
  const utilities: UtilityCard[] = [
    {
      title: 'Thiệp Chúc Tết',
      description: 'Tạo thiệp, gửi lời chúc và nhận lì xì trực tuyến.',
      icon: <Gift className="h-6 w-6" />,
      href: '/greetings',
      available: true,
      accent: 'primary',
    },
    {
      title: 'Life in Weeks',
      description: 'Theo dõi hành trình cuộc sống theo tuần.',
      icon: <Calendar className="h-6 w-6" />,
      href: '/life/weeks',
      available: true,
      accent: 'blue',
    },
    {
      title: 'Pomodoro Timer',
      description: 'Quản lý thời gian với kỹ thuật Pomodoro.',
      icon: <Clock className="h-6 w-6" />,
      href: '#',
      available: false,
      accent: 'emerald',
    },
  ]

  return (
    <>
      <Head title="Tiện Ích" />

      <div className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-dashed">
              Bộ sưu tập
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">Tiện ích WithDui</h1>
            <p className="text-muted-foreground">
              Những công cụ nhỏ gọn giúp bạn quản lý cuộc sống và sẻ chia lời chúc.
            </p>
          </div>
          <Badge variant="secondary" className="self-start">
            Beta
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {utilities.map((utility) => {
            const accent = ACCENT_STYLES[utility.accent]

            return (
              <Card
                key={utility.title}
                className={cn(
                  'relative h-full overflow-hidden border-2 bg-card',
                  !utility.available && 'opacity-70'
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    'absolute inset-0 -z-[1] bg-gradient-to-br opacity-70 blur-[90px]',
                    accent.glow
                  )}
                />

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        'flex size-12 items-center justify-center rounded-md border-2',
                        accent.icon
                      )}
                    >
                      {utility.icon}
                    </div>
                    {!utility.available && (
                      <Badge variant="outline" className="border-dashed">
                        Sắp ra mắt
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{utility.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {utility.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex items-center justify-between gap-3">
                  <div
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium border',
                      accent.pill,
                      accent.border
                    )}
                  >
                    {utility.available ? 'Sẵn sàng' : 'Đang phát triển'}
                  </div>
                  {utility.available ? (
                    <Button asChild size="sm">
                      <Link href={utility.href}>Mở tiện ích</Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Chờ ra mắt
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}
