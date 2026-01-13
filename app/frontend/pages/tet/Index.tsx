import { Head, Link } from '@inertiajs/react'
import { Eye, Gift, PlusCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type GreetingList from '@/types/serializers/GreetingList'

interface Props {
  greetings: GreetingList[]
}

export default function Index({ greetings }: Props) {
  return (
    <>
      <Head title="Thiệp Chúc Tết" />

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-600">🧧 Thiệp Chúc Tết</h1>
            <p className="text-gray-600 mt-2">Tạo và quản lý thiệp chúc Tết của bạn</p>
          </div>
          <Link href="/greetings/new">
            <Button className="bg-red-600 hover:bg-red-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tạo Thiệp Mới
            </Button>
          </Link>
        </div>

        {greetings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🎊</div>
              <h3 className="text-xl font-semibold mb-2">Chưa có thiệp nào</h3>
              <p className="text-gray-600 mb-6">
                Tạo thiệp chúc Tết đầu tiên để gửi lời chúc đến người thân
              </p>
              <Link href="/greetings/new">
                <Button className="bg-red-600 hover:bg-red-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tạo Thiệp Đầu Tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {greetings.map((greeting) => (
              <Link key={greeting.id} href={`/greetings/${greeting.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-red-100 hover:border-red-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{greeting.title}</CardTitle>
                      {greeting.published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          Nháp
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      Tạo lúc {new Date(greeting.createdAt).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex justify-center mb-1">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {greeting.totalRecipients}
                        </div>
                        <div className="text-xs text-gray-600">Người nhận</div>
                      </div>
                      <div>
                        <div className="flex justify-center mb-1">
                          <Eye className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {greeting.totalViews}
                        </div>
                        <div className="text-xs text-gray-600">Lượt xem</div>
                      </div>
                      <div>
                        <div className="flex justify-center mb-1">
                          <Gift className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {(greeting.totalLixi || 0).toLocaleString('vi-VN')}₫
                        </div>
                        <div className="text-xs text-gray-600">Lì xì</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
