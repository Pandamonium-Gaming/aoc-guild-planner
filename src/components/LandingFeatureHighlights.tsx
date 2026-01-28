import { Pickaxe, Hammer, Sword } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FeaturePlaceholder } from '@/components/FeaturePlaceholder';

export function LandingFeatureHighlights() {
  const { t } = useLanguage();
  return (
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <FeaturePlaceholder
        icon={Pickaxe}
        titleKey="home.feature1Title"
        descKey="home.feature1Desc"
        color="amber"
      />
      <FeaturePlaceholder
        icon={Hammer}
        titleKey="home.feature2Title"
        descKey="home.feature2Desc"
        color="cyan"
      />
      <FeaturePlaceholder
        icon={Sword}
        titleKey="home.feature3Title"
        descKey="home.feature3Desc"
        color="orange"
      />
    </div>
  );
}
