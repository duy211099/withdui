import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type Greeting from '@/types/serializers/Greeting'
import type Recipient from '@/types/serializers/Recipient'

interface PaymentInfo {
  bankName?: string
  accountNumber?: string
  accountName?: string
  phoneNumber?: string
}

interface Props {
  greeting: Greeting
  recipients: Recipient[]
}

export default function Edit({ greeting, recipients: initialRecipients }: Props) {
  const { data, setData, put, processing } = useForm({
    title: greeting.title,
    message: greeting.message || '',
    paymentMethod: greeting.paymentMethod,
    paymentInfo: (greeting.paymentInfo || {}) as PaymentInfo,
    recipients: initialRecipients,
  })

  const [recipientName, setRecipientName] = useState('')

  const addRecipient = () => {
    if (recipientName.trim()) {
      setData('recipients', [
        ...data.recipients,
        {
          id: '',
          name: recipientName.trim(),
          token: '',
          gaveLixi: false,
          lixiAmount: 0,
          viewUrl: '',
        },
      ])
      setRecipientName('')
    }
  }

  const removeRecipient = (index: number) => {
    setData(
      'recipients',
      data.recipients.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    put(`/greetings/${greeting.id}`)
  }

  const updatePaymentInfo = (key: string, value: string) => {
    setData('paymentInfo', { ...data.paymentInfo, [key]: value })
  }

  return (
    <>
      <Head title={`Chỉnh sửa: ${greeting.title}`} />

      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="border-dashed">
              Thiệp Tết
            </Badge>
            <h1 className="text-3xl font-semibold leading-tight">Chỉnh sửa thiệp</h1>
            <p className="text-muted-foreground">
              Cập nhật tiêu đề, lời chúc và thông tin nhận lì xì cho người thân.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="sm:self-start">
            <Link href={`/greetings/${greeting.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại chi tiết
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Thông tin thiệp</CardTitle>
              <CardDescription>Tiêu đề và lời chúc được hiển thị cho người nhận.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề thiệp *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Chúc Mừng Năm Mới 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Lời chúc</Label>
                <Textarea
                  id="message"
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  placeholder="Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý..."
                  rows={5}
                />
                <p className="text-sm text-muted-foreground">
                  Để trống nếu bạn muốn dùng lời chúc mặc định.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Thông tin lì xì</CardTitle>
              <CardDescription>Chọn phương thức và điền thông tin nhận tiền.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment_method">Phương thức</Label>
                <Select
                  value={data.paymentMethod}
                  onValueChange={(value) => setData('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vietqr">VietQR (Ngân hàng)</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="zalopay">ZaloPay</SelectItem>
                    <SelectItem value="bank_account">Số tài khoản ngân hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(data.paymentMethod === 'vietqr' || data.paymentMethod === 'bank_account') && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bankName">Tên ngân hàng *</Label>
                    <Input
                      id="bankName"
                      value={data.paymentInfo.bankName || ''}
                      onChange={(e) => updatePaymentInfo('bankName', e.target.value)}
                      placeholder="Vietcombank"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Số tài khoản *</Label>
                    <Input
                      id="accountNumber"
                      value={data.paymentInfo.accountNumber || ''}
                      onChange={(e) => updatePaymentInfo('accountNumber', e.target.value)}
                      placeholder="9915792897"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Tên chủ tài khoản *</Label>
                    <Input
                      id="accountName"
                      value={data.paymentInfo.accountName || ''}
                      onChange={(e) => updatePaymentInfo('accountName', e.target.value)}
                      placeholder="PHAM BA XUAN DUY"
                    />
                  </div>
                </div>
              )}

              {(data.paymentMethod === 'momo' || data.paymentMethod === 'zalopay') && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={data.paymentInfo.phoneNumber || ''}
                    onChange={(e) => updatePaymentInfo('phoneNumber', e.target.value)}
                    placeholder="0915792897"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Danh sách người nhận</CardTitle>
              <CardDescription>Thêm hoặc xoá người sẽ nhận thiệp.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Tên người nhận mới"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRecipient()
                    }
                  }}
                />
                <Button type="button" onClick={addRecipient} className="sm:w-auto">
                  <PlusCircle className="h-4 w-4" />
                  Thêm
                </Button>
              </div>

              {data.recipients.length > 0 && (
                <div className="space-y-2">
                  {data.recipients.map((recipient, index) => (
                    <div
                      key={recipient.id || `new-${index}`}
                      className="flex items-center justify-between rounded-md border-2 border-border bg-card/80 px-3 py-2"
                    >
                      <span className="font-medium">{recipient.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeRecipient(index)}
                        aria-label={`Xóa ${recipient.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground">
                    Tổng: {data.recipients.length} người nhận
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
