import { Head } from '@inertiajs/react'
import { Gift } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type PaymentInfo = {
  bankName?: string
  accountNumber?: string
  accountName?: string
  phoneNumber?: string
}

interface Greeting {
  title: string
  message?: string | null
  paymentMethod?: string | null
  paymentInfo?: PaymentInfo | null
  payment_method?: string | null
  payment_info?: PaymentInfo | null
}

interface Recipient {
  name: string
  viewedAt: string | null
}

interface Props {
  greeting: Greeting
  recipient: Recipient
}

const PAYMENT_LABELS: Record<string, string> = {
  vietqr: 'VietQR / ngân hàng',
  bank_account: 'Chuyển khoản ngân hàng',
  momo: 'MoMo',
  zalopay: 'ZaloPay',
}

export default function View({ greeting, recipient }: Props) {
  const [showLixiDialog, setShowLixiDialog] = useState(false)
  const [lixiSent, setLixiSent] = useState(false)

  const paymentMethod = greeting.paymentMethod || greeting.payment_method || 'vietqr'
  const paymentInfo: PaymentInfo = greeting.paymentInfo ?? greeting.payment_info ?? {}
  const paymentLabel = PAYMENT_LABELS[paymentMethod] ?? 'Chuyển khoản'

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all text-right font-semibold">{value || '—'}</span>
    </div>
  )

  const handleLixiClick = () => {
    setShowLixiDialog(true)
  }

  const handleConfirmLixi = async () => {
    try {
      const response = await fetch(`${window.location.pathname}/mark_lixi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setLixiSent(true)
        setShowLixiDialog(false)
      }
    } catch (error) {
      console.error('Failed to mark lixi:', error)
    }
  }

  const renderPaymentInfo = () => {
    if (paymentMethod === 'vietqr' || paymentMethod === 'bank_account') {
      const hasBankDetails =
        paymentInfo.bankName && paymentInfo.accountNumber && paymentInfo.accountName

      return (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {paymentMethod === 'vietqr'
              ? 'Quét mã hoặc nhập thông tin bên dưới. Thêm nội dung chuyển khoản "Li Xi Tet".'
              : 'Chuyển khoản trực tiếp bằng thông tin bên dưới.'}
          </div>

          {hasBankDetails && (
            <div className="flex justify-center">
              <img
                src={`https://img.vietqr.io/image/${paymentInfo.bankName}-${paymentInfo.accountNumber}-compact2.jpg?amount=&addInfo=Li%20Xi%20Tet&accountName=${encodeURIComponent(paymentInfo.accountName || '')}`}
                alt="Mã VietQR"
                className="w-full max-w-xs rounded-lg border-2 border-border bg-card p-3"
              />
            </div>
          )}

          <div className="rounded-lg border-2 border-border bg-card/80 px-4 py-4 space-y-3">
            <InfoRow label="Ngân hàng" value={paymentInfo.bankName} />
            <InfoRow label="Số tài khoản" value={paymentInfo.accountNumber} />
            <InfoRow label="Chủ tài khoản" value={paymentInfo.accountName} />
          </div>
        </div>
      )
    }

    if (paymentMethod === 'momo') {
      return (
        <div className="space-y-4">
          {paymentInfo.phoneNumber && (
            <div className="flex justify-center">
              <img
                src={`https://momosv3.apimienphi.com/api/QRCode?phone=${paymentInfo.phoneNumber}`}
                alt="Mã MoMo"
                className="w-full max-w-[220px] rounded-lg border-2 border-border bg-card p-3"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          <div className="rounded-lg border-2 border-border bg-card/80 px-4 py-4 space-y-3">
            <InfoRow label="Số điện thoại MoMo" value={paymentInfo.phoneNumber} />
            {paymentInfo.phoneNumber && (
              <Button asChild variant="secondary" className="w-full">
                <a
                  href={`momo://transfer?phone=${paymentInfo.phoneNumber}`}
                  className="no-underline"
                >
                  Mở ứng dụng MoMo
                </a>
              </Button>
            )}
          </div>
        </div>
      )
    }

    if (paymentMethod === 'zalopay') {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-border bg-card/80 px-4 py-4 space-y-3">
            <InfoRow label="Số điện thoại ZaloPay" value={paymentInfo.phoneNumber} />
            {paymentInfo.phoneNumber && (
              <Button asChild variant="secondary" className="w-full">
                <a href="zalopay://app" className="no-underline">
                  Mở ứng dụng ZaloPay
                </a>
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              Mở ZaloPay → Chuyển tiền → Nhập số điện thoại ở trên.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="rounded-lg border-2 border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Người gửi chưa cấu hình thông tin nhận lì xì.
      </div>
    )
  }

  return (
    <>
      <Head title={greeting.title} />

      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="border-dashed tracking-wide">
                Thiệp chúc Tết
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight">{greeting.title}</h1>
              <p className="text-muted-foreground">
                Gửi tới <span className="font-medium text-foreground">{recipient.name}</span>
              </p>
            </div>
            <Badge variant="secondary" className="self-start">
              {paymentLabel}
            </Badge>
          </div>

          <Card className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute -right-10 top-6 h-24 w-24 rotate-6 rounded-full border-2 border-border/40 bg-accent/40"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-8 -bottom-10 h-20 w-36 rotate-3 border-2 border-dashed border-border/30 bg-primary/10"
              aria-hidden="true"
            />

            <CardContent className="relative space-y-6">
              <div className="rounded-lg border-2 border-dashed border-border/70 bg-card/80 px-5 py-5 text-lg leading-relaxed whitespace-pre-wrap">
                {greeting.message || 'Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý!'}
              </div>

              {lixiSent ? (
                <div className="rounded-lg border-2 border-primary bg-primary/10 px-4 py-4 text-primary">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💚</span>
                    <div>
                      <p className="font-semibold">Đã ghi nhận lì xì của bạn</p>
                      <p className="text-sm text-primary/80">
                        Cảm ơn bạn đã gửi lời chúc và chia sẻ may mắn.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Gửi một chút lì xì tới {recipient.name}
                    </span>
                    <span>Thông tin nhận: {paymentLabel}</span>
                  </div>
                  <Button size="lg" onClick={handleLixiClick} className="w-full sm:w-auto">
                    <Gift className="h-5 w-5" />
                    Xem thông tin lì xì
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Được gửi bằng WithDui • Chúc bạn năm mới an vui.</span>
            <span className="text-xs">Liên kết này dành riêng cho bạn.</span>
          </div>
        </div>
      </div>

      <Dialog open={showLixiDialog} onOpenChange={setShowLixiDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Gửi lì xì</DialogTitle>
            <DialogDescription>Chọn cách chuyển khoản phù hợp</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm">
                <p className="font-semibold text-foreground">Phương thức</p>
                <p className="text-muted-foreground">{paymentLabel}</p>
              </div>
              <Badge variant="secondary">{paymentLabel}</Badge>
            </div>

            {renderPaymentInfo()}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleConfirmLixi} className="flex-1">
                Đã chuyển khoản
              </Button>
              <Button variant="outline" onClick={() => setShowLixiDialog(false)} className="flex-1">
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Disable default layout for clean public view - return page as-is without wrapper
View.layout = (page: ReactNode) => page
