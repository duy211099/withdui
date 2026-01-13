import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'
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

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <a
            href={`/greetings/${greeting.id}`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại chi tiết
          </a>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-8">✏️ Chỉnh Sửa Thiệp</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Thiệp</CardTitle>
              <CardDescription>Cập nhật tiêu đề và lời chúc</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề thiệp *</Label>
                <Input
                  id="title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                  placeholder="Chúc Mừng Năm Mới 2025"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Lời chúc</Label>
                <Textarea
                  id="message"
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  placeholder="Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Lì Xì</CardTitle>
              <CardDescription>Cập nhật thông tin thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="payment_method">Phương thức</Label>
                <Select
                  value={data.paymentMethod}
                  onValueChange={(value) => setData('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vietqr">VietQR (Ngân hàng)</SelectItem>
                    <SelectItem value="momo">MoMo</SelectItem>
                    <SelectItem value="zalopay">ZaloPay</SelectItem>
                    <SelectItem value="bank_account">Số tài khoản ngân hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic payment info fields */}
              {(data.paymentMethod === 'vietqr' || data.paymentMethod === 'bank_account') && (
                <>
                  <div>
                    <Label htmlFor="bankName">Tên ngân hàng *</Label>
                    <Input
                      id="bankName"
                      value={data.paymentInfo.bankName || ''}
                      onChange={(e) => updatePaymentInfo('bankName', e.target.value)}
                      placeholder="Vietcombank"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Số tài khoản *</Label>
                    <Input
                      id="accountNumber"
                      value={data.paymentInfo.accountNumber || ''}
                      onChange={(e) => updatePaymentInfo('accountNumber', e.target.value)}
                      placeholder="9915792897"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountName">Tên chủ tài khoản *</Label>
                    <Input
                      id="accountName"
                      value={data.paymentInfo.accountName || ''}
                      onChange={(e) => updatePaymentInfo('accountName', e.target.value)}
                      placeholder="PHAM BA XUAN DUY"
                    />
                  </div>
                </>
              )}

              {(data.paymentMethod === 'momo' || data.paymentMethod === 'zalopay') && (
                <div>
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

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Người Nhận</CardTitle>
              <CardDescription>Quản lý người nhận thiệp chúc Tết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
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
                <Button type="button" onClick={addRecipient} variant="outline">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              {data.recipients.length > 0 && (
                <div className="space-y-2">
                  {data.recipients.map((recipient, index) => (
                    <div
                      key={recipient.id || `new-${index}`}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded"
                    >
                      <span>{recipient.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                  <p className="text-sm text-gray-600">Tổng: {data.recipients.length} người nhận</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={processing}
              className="bg-red-600 hover:bg-red-700 flex-1"
            >
              {processing ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
