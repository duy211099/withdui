import { Head, Link } from '@inertiajs/react'
import { Calendar, Clock, Gift } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UtilityCard {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  gradient: string
  available: boolean
}

export default function Index() {
  const utilities: UtilityCard[] = [
    {
      title: '🧧 Thiệp Chúc Tết',
      description: 'Tạo thiệp chúc Tết với lời chúc và nhận lì xì từ người thân',
      icon: <Gift className="h-8 w-8" />,
      href: '/greetings',
      gradient: 'from-red-500 to-orange-500',
      available: true,
    },
    {
      title: '📅 Life in Weeks',
      description: 'Visualize your life in weeks - See the big picture',
      icon: <Calendar className="h-8 w-8" />,
      href: '/life/weeks',
      gradient: 'from-blue-500 to-cyan-500',
      available: true,
    },
    {
      title: '⏰ Pomodoro Timer',
      description: 'Quản lý thời gian hiệu quả với kỹ thuật Pomodoro',
      icon: <Clock className="h-8 w-8" />,
      href: '#',
      gradient: 'from-green-500 to-emerald-500',
      available: false,
    },
  ]

  return (
    <>
      <Head title="Tiện Ích" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🛠️ Tiện Ích</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bộ sưu tập các công cụ và tiện ích hữu ích cho cuộc sống
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((utility) => (
            <Card
              key={utility.title}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${
                utility.available ? 'cursor-pointer' : 'opacity-60'
              }`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-2 bg-linear-to-r ${utility.gradient}`}
              />
              <CardHeader className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-3 rounded-lg bg-linear-to-r ${utility.gradient} text-white`}>
                    {utility.icon}
                  </div>
                  {!utility.available && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      Sắp ra mắt
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl">{utility.title}</CardTitle>
                <CardDescription className="text-sm">{utility.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {utility.available ? (
                  <Link
                    href={utility.href}
                    className={`block w-full text-center bg-linear-to-r ${utility.gradient} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105`}
                  >
                    Sử dụng →
                  </Link>
                ) : (
                  <div className="w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                    Sắp có
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Có ý tưởng về tiện ích mới?{' '}
            <a href="mailto:contact@withdui.com" className="text-blue-600 hover:text-blue-700">
              Liên hệ với chúng tôi
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
