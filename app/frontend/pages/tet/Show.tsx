import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, CheckCircle, Copy, Eye, Gift, Users, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type Greeting from '@/types/serializers/Greeting'
import type Recipient from '@/types/serializers/Recipient'

interface Props {
  greeting: Greeting
  recipients: Recipient[]
}

export default function Show({ greeting, recipients }: Props) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const handlePublish = () => {
    if (confirm('Xuất bản thiệp? Người nhận sẽ có thể xem thiệp qua link.')) {
      router.post(`/greetings/${greeting.id}/publish`, {})
    }
  }

  const handleUnpublish = () => {
    if (confirm('Hủy xuất bản thiệp?')) {
      router.post(`/greetings/${greeting.id}/unpublish`, {})
    }
  }

  const handleDelete = () => {
    if (confirm('Xóa thiệp này? Hành động không thể hoàn tác!')) {
      router.delete(`/greetings/${greeting.id}`)
    }
  }

  return (
    <>
      <Head title={greeting.title} />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-6">
          <Link
            href="/greetings"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Link>
        </div>

        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">{greeting.title}</h1>
              <div className="flex gap-2 items-center">
                {greeting.published ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Đã xuất bản
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    Chưa xuất bản
                  </span>
                )}
                <span className="text-sm text-gray-600">
                  Tạo lúc {new Date(greeting.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/greetings/${greeting.id}/edit`}>
                <Button variant="outline">Chỉnh sửa</Button>
              </Link>
              {greeting.published ? (
                <Button variant="outline" onClick={handleUnpublish}>
                  Hủy xuất bản
                </Button>
              ) : (
                <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
                  Xuất bản
                </Button>
              )}
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Người nhận</p>
                    <p className="text-2xl font-bold text-blue-600">{greeting.totalRecipients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã xem</p>
                    <p className="text-2xl font-bold text-green-600">{greeting.totalViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã lì xì</p>
                    <p className="text-2xl font-bold text-orange-600">{greeting.totalGaveLixi}</p>
                  </div>
                  <Gift className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng lì xì</p>
                    <p className="text-2xl font-bold text-red-600">
                      {(greeting.totalLixiReceived || 0).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <Gift className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Greeting content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Nội dung thiệp</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">
              {greeting.message || 'Chưa có lời chúc'}
            </p>
          </CardContent>
        </Card>

        {/* Recipients list */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người nhận ({recipients.length})</CardTitle>
            <CardDescription>
              {greeting.published
                ? 'Chia sẻ link cho từng người để họ xem thiệp'
                : 'Xuất bản thiệp để chia sẻ link'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recipients.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Chưa có người nhận nào</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Lì xì</TableHead>
                    <TableHead>Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id}>
                      <TableCell className="font-medium">{recipient.name}</TableCell>
                      <TableCell>
                        {recipient.viewedAt ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Đã xem {new Date(recipient.viewedAt).toLocaleDateString('vi-VN')}
                          </span>
                        ) : (
                          <span className="text-gray-500">Chưa xem</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {recipient.gaveLixi ? (
                          <span className="text-red-600 font-semibold">
                            {recipient.lixiAmount?.toLocaleString('vi-VN')}₫
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(recipient.viewUrl, recipient.token)}
                          disabled={!greeting.published}
                        >
                          {copiedToken === recipient.token ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Đã copy
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy link
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
