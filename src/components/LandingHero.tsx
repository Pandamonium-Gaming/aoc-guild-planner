import { Pickaxe, Hammer, Sword } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LandingHero() {
  const { t } = useLanguage();
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-8">
        <Pickaxe className="w-8 h-8 text-amber-400" />
        <Hammer className="w-10 h-10 text-orange-400" />
        <Sword className="w-8 h-8 text-rose-400" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
        {t('home.title')}
      </h1>
      <p className="text-slate-400 text-lg mb-8">
        {t('home.subtitle')}
      </p>
    </div>
  );
}
