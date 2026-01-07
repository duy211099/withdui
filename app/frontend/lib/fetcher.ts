import axios from 'axios'
import { toast } from 'sonner'

export const fetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get<T>(url)
    return response.data
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? error.message ?? 'Request failed'
      : error instanceof Error
        ? error.message
        : 'Request failed'

    toast.error(message)
    throw error
  }
}
