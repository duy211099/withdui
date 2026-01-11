import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/I18nContext'

export default function InertiaExample() {
  const { t } = useTranslation()
  return (
    <h1>
      {t('frontend.v1.hello.greeting')}
      <Button />
    </h1>
  )
}
