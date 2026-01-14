import { Head } from '@inertiajs/react'
import { Lock } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  message: string
}

export default function Unpublished({ message }: Props) {
  return (
    <>
      <Head title="Thiệp Chưa Được Xuất Bản" />

      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-border bg-muted/60">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="border-dashed">
                Chưa xuất bản
              </Badge>
            </div>
            <CardTitle className="text-2xl font-semibold">Thiệp chưa sẵn sàng</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Thiệp này chưa được chia sẻ công khai.</p>
            <p>Vui lòng liên hệ người gửi để nhận link khi thiệp được xuất bản.</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

// Disable default layout for clean public view - return page as-is without wrapper
Unpublished.layout = (page: ReactNode) => page
