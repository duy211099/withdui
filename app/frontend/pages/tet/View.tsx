import { Head } from '@inertiajs/react'
import { Gift } from 'lucide-react'
import { type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Greeting {
  title: string
  message: string
  paymentMethod: string
  paymentInfo: {
    bankName?: string
    accountNumber?: string
    accountName?: string
    phoneNumber?: string
  }
}

interface Recipient {
  name: string
  viewedAt: string | null
}

interface Props {
  greeting: Greeting
  recipient: Recipient
}

export default function View({ greeting, recipient }: Props) {
  const [showLixiDialog, setShowLixiDialog] = useState(false)
  const [lixiSent, setLixiSent] = useState(false)

  const handleLixiClick = () => {
    setShowLixiDialog(true)
  }

  const handleConfirmLixi = async () => {
    try {
      // Mark as gave lixi
      const response = await fetch(`${window.location.pathname}/mark_lixi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setLixiSent(true)
      }
    } catch (error) {
      console.error('Failed to mark lixi:', error)
    }
  }

  const renderPaymentInfo = () => {
    const { paymentMethod, paymentInfo } = greeting

    if (paymentMethod === 'vietqr' || paymentMethod === 'bank_account') {
      return (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Quét mã QR để chuyển khoản</p>
            {paymentInfo.bankName && paymentInfo.accountNumber && paymentInfo.accountName && (
              <img
                src={`https://img.vietqr.io/image/${paymentInfo.bankName}-${paymentInfo.accountNumber}-compact2.jpg?amount=&addInfo=Li%20Xi%20Tet&accountName=${encodeURIComponent(paymentInfo.accountName)}`}
                alt="VietQR Code"
                className="mx-auto rounded-lg shadow-lg max-w-sm"
              />
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngân hàng:</span>
              <span className="font-semibold">{paymentInfo.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tài khoản:</span>
              <span className="font-semibold font-mono">{paymentInfo.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ tài khoản:</span>
              <span className="font-semibold">{paymentInfo.accountName}</span>
            </div>
          </div>
        </div>
      )
    }

    if (paymentMethod === 'momo') {
      return (
        <div className="space-y-3">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Quét mã QR MoMo</p>
            {paymentInfo.phoneNumber && (
              <img
                src={`https://momosv3.apimienphi.com/api/QRCode?phone=${paymentInfo.phoneNumber}`}
                alt="MoMo QR Code"
                className="mx-auto rounded-lg shadow-lg max-w-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
          <div className="bg-purple-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Số điện thoại MoMo:</span>
              <span className="font-semibold font-mono">{paymentInfo.phoneNumber}</span>
            </div>
            {paymentInfo.phoneNumber && (
              <a
                href={`momo://transfer?phone=${paymentInfo.phoneNumber}`}
                className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all transform hover:scale-105"
              >
                📱 Mở ứng dụng MoMo
              </a>
            )}
          </div>
        </div>
      )
    }

    if (paymentMethod === 'zalopay') {
      return (
        <div className="bg-blue-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Số điện thoại ZaloPay:</span>
            <span className="font-semibold font-mono">{paymentInfo.phoneNumber}</span>
          </div>
          <p className="text-sm text-gray-600">Mở ZaloPay → Chuyển tiền → Nhập số điện thoại</p>
          {paymentInfo.phoneNumber && (
            <a
              href="zalopay://app"
              className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-all transform hover:scale-105"
            >
              📱 Mở ứng dụng ZaloPay
            </a>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <>
      <Head title={greeting.title} />

      {/* Force light theme - Background with Tet decorations */}
      <div className="light min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 py-12 px-4">
        {/* Animated decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎊</div>
          <div className="absolute top-20 right-20 text-6xl animate-pulse">🧧</div>
          <div className="absolute bottom-20 left-20 text-6xl animate-bounce delay-100">🏮</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-pulse delay-200">🎆</div>
        </div>

        <div className="container mx-auto max-w-2xl relative z-10">
          {/* Main greeting card */}
          <Card className="border-4 border-red-300 shadow-2xl bg-white/95 backdrop-blur">
            <CardHeader className="text-center bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-3xl font-bold mb-2">{greeting.title}</CardTitle>
              <CardDescription className="text-red-100 text-lg">
                Dành tặng {recipient.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8 space-y-6">
              {/* Greeting message */}
              <div className="text-center">
                <p className="text-xl leading-relaxed whitespace-pre-wrap text-gray-700">
                  {greeting.message || 'Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý! 🎊'}
                </p>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center justify-center gap-2 my-6">
                <span className="text-2xl">✨</span>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
                <span className="text-2xl">🧧</span>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
                <span className="text-2xl">✨</span>
              </div>

              {/* Li xi button */}
              {!lixiSent ? (
                <div className="text-center">
                  <Button
                    onClick={handleLixiClick}
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
                  >
                    <Gift className="mr-2 h-6 w-6" />
                    Gửi Lì Xì 🧧
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">Nhấn để xem thông tin chuyển khoản</p>
                </div>
              ) : (
                <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-300">
                  <div className="text-6xl mb-3">💚</div>
                  <p className="text-xl font-semibold text-green-800">Cảm ơn bạn đã gửi lì xì!</p>
                  <p className="text-sm text-green-700 mt-2">
                    Chúc bạn năm mới tràn đầy niềm vui và hạnh phúc!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              Tạo thiệp chúc Tết của riêng bạn tại{' '}
              <a href="/" className="text-red-600 hover:text-red-700 font-semibold">
                WithDui.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Li xi dialog */}
      <Dialog open={showLixiDialog} onOpenChange={setShowLixiDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">🧧 Gửi Lì Xì</DialogTitle>
            <DialogDescription className="text-center">
              Quét mã QR hoặc chuyển khoản theo thông tin dưới đây
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {renderPaymentInfo()}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleConfirmLixi}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
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
