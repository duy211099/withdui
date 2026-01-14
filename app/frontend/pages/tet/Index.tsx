import { Head, Link } from '@inertiajs/react'
import { Eye, Gift, PlusCircle, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type GreetingList from '@/types/serializers/GreetingList'

interface Props {
  greetings: GreetingList[]
}

export default function Index({ greetings }: Props) {
  const totalRecipients = greetings.reduce((sum, item) => sum + item.totalRecipients, 0)
  const totalViews = greetings.reduce((sum, item) => sum + item.totalViews, 0)
  const totalLixi = greetings.reduce((sum, item) => sum + (item.totalLixi || 0), 0)

  return (
    <>
      <Head title="Thiệp Chúc Tết" />

      <div className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-dashed">
              Thiệp Tết
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">Quản lý thiệp chúc Tết</h1>
            <p className="text-muted-foreground">
              Tạo, xuất bản và theo dõi lời chúc dành cho người thân.
            </p>
          </div>
          <Button asChild size="lg" className="sm:self-start">
            <Link href="/greetings/new">
              <PlusCircle className="h-4 w-4" />
              Tạo thiệp mới
            </Link>
          </Button>
        </div>

        {greetings.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardDescription>Người nhận</CardDescription>
                <CardTitle className="text-2xl">{totalRecipients}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Tổng số người nhận ở tất cả thiệp.
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardDescription>Lượt xem</CardDescription>
                <CardTitle className="text-2xl">{totalViews}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Tổng lượt xem từ người nhận.
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardDescription>Tổng lì xì</CardDescription>
                <CardTitle className="text-2xl">{totalLixi.toLocaleString('vi-VN')}₫</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                Số tiền lì xì được ghi nhận.
              </CardContent>
            </Card>
          </div>
        )}

        {greetings.length === 0 ? (
          <Card className="border-dashed text-center">
            <CardContent className="space-y-4 py-10">
              <div className="text-5xl">🧧</div>
              <div className="space-y-1">
                <CardTitle className="text-xl">Chưa có thiệp nào</CardTitle>
                <CardDescription>
                  Bắt đầu tạo thiệp chúc Tết đầu tiên của bạn ngay bây giờ.
                </CardDescription>
              </div>
              <Button asChild>
                <Link href="/greetings/new">
                  <PlusCircle className="h-4 w-4" />
                  Tạo thiệp đầu tiên
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {greetings.map((greeting) => (
              <Link key={greeting.id} href={`/greetings/${greeting.id}`}>
                <Card className="h-full cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[2px_2px_0_var(--shadow-color)]">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl leading-snug">{greeting.title}</CardTitle>
                      <Badge variant={greeting.published ? 'secondary' : 'outline'}>
                        {greeting.published ? 'Đã xuất bản' : 'Nháp'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Tạo lúc {new Date(greeting.createdAt).toLocaleDateString('vi-VN')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="space-y-1">
                        <div className="mx-auto flex size-9 items-center justify-center rounded-md border-2 border-border bg-muted/50">
                          <Users className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-semibold">{greeting.totalRecipients}</p>
                        <p className="text-muted-foreground">Người nhận</p>
                      </div>
                      <div className="space-y-1">
                        <div className="mx-auto flex size-9 items-center justify-center rounded-md border-2 border-border bg-muted/50">
                          <Eye className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-semibold">{greeting.totalViews}</p>
                        <p className="text-muted-foreground">Lượt xem</p>
                      </div>
                      <div className="space-y-1">
                        <div className="mx-auto flex size-9 items-center justify-center rounded-md border-2 border-border bg-muted/50">
                          <Gift className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-semibold">
                          {(greeting.totalLixi || 0).toLocaleString('vi-VN')}₫
                        </p>
                        <p className="text-muted-foreground">Lì xì</p>
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
