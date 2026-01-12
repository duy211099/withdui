import { ExternalLink, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/contexts/I18nContext'

export default function LifeWeeksFacts() {
  const { t } = useI18n()

  const facts = [
    {
      titleKey: 'frontend.life_weeks.facts.weeks_in_life.title',
      textKey: 'frontend.life_weeks.facts.weeks_in_life.text',
      linkKey: 'frontend.life_weeks.facts.weeks_in_life.link',
      linkTextKey: 'frontend.life_weeks.facts.weeks_in_life.link_text',
    },
    {
      titleKey: 'frontend.life_weeks.facts.telomeres.title',
      textKey: 'frontend.life_weeks.facts.telomeres.text',
      linkKey: 'frontend.life_weeks.facts.telomeres.link',
      linkTextKey: 'frontend.life_weeks.facts.telomeres.link_text',
    },
    {
      titleKey: 'frontend.life_weeks.facts.time_perception.title',
      textKey: 'frontend.life_weeks.facts.time_perception.text',
      linkKey: 'frontend.life_weeks.facts.time_perception.link',
      linkTextKey: 'frontend.life_weeks.facts.time_perception.link_text',
    },
    {
      titleKey: 'frontend.life_weeks.facts.circadian.title',
      textKey: 'frontend.life_weeks.facts.circadian.text',
      linkKey: 'frontend.life_weeks.facts.circadian.link',
      linkTextKey: 'frontend.life_weeks.facts.circadian.link_text',
    },
    {
      titleKey: 'frontend.life_weeks.facts.blue_zones.title',
      textKey: 'frontend.life_weeks.facts.blue_zones.text',
      linkKey: 'frontend.life_weeks.facts.blue_zones.link',
      linkTextKey: 'frontend.life_weeks.facts.blue_zones.link_text',
    },
  ]

  return (
    <Card className="hover:translate-x-0 hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          {t('frontend.life_weeks.facts.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facts.map((fact, index) => (
            <div
              key={`fact-${index.toString()}`}
              className="pb-4 last:pb-0 last:border-0 border-b border-border"
            >
              <h4 className="font-semibold text-sm mb-1">{t(fact.titleKey)}</h4>
              <p className="text-sm text-muted-foreground mb-2">{t(fact.textKey)}</p>
              <a
                href={t(fact.linkKey)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {t(fact.linkTextKey)}
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
