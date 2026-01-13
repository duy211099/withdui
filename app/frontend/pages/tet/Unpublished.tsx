import { Head } from '@inertiajs/react'
import type { ReactNode } from 'react'

interface Props {
  message: string
}

export default function Unpublished({ message }: Props) {
  return (
    <>
      <Head title="Thiệp Chưa Được Xuất Bản" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-9xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thiệp Chưa Được Xuất Bản</h1>
          <p className="text-gray-600 mb-8">{message}</p>
          <p className="text-sm text-gray-500">
            Thiệp này chưa sẵn sàng để xem. Vui lòng liên hệ người gửi để biết thêm thông tin.
          </p>
        </div>
      </div>
    </>
  )
}

// Disable default layout for clean public view - return page as-is without wrapper
Unpublished.layout = (page: ReactNode) => page
