import { useTranslation } from '@/contexts/I18nContext'

export default function Index() {
  const { t } = useTranslation()
  return <div>{t('frontend.utils.index.title')}</div>
}
