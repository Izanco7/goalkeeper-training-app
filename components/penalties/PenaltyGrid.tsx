import { useTranslations } from 'next-intl';

interface PenaltyGridProps {
  direction: 'left' | 'center' | 'right';
  height: 'low' | 'mid' | 'high';
  onSelect?: (direction: 'left' | 'center' | 'right', height: 'low' | 'mid' | 'high') => void;
  showResult?: boolean;
  result?: 'saved' | 'goal' | 'missed' | 'post';
  readOnly?: boolean;
}

const getResultBadge = (result: string) => {
  switch (result) {
    case 'saved':
      return 'bg-lime-400/15 text-lime-300 border-lime-400/30';
    case 'goal':
      return 'bg-red-500/15 text-red-300 border-red-500/30';
    case 'missed':
      return 'bg-amber-400/15 text-amber-300 border-amber-400/30';
    case 'post':
      return 'bg-orange-500/15 text-orange-300 border-orange-500/30';
    default:
      return 'bg-white/5 text-white/60 border-white/10';
  }
};

export default function PenaltyGrid({ 
  direction, 
  height, 
  onSelect, 
  showResult = false,
  result,
  readOnly = false 
}: PenaltyGridProps) {
  const t = useTranslations('penalties');

  const getZoneClass = (zoneDir: string, zoneHeight: string) => {
    const isSelected = direction === zoneDir && height === zoneHeight;
    
    if (isSelected) {
      if (showResult && result) {
        switch (result) {
          case 'saved':
            return 'bg-lime-400/30 border-lime-400';
          case 'goal':
            return 'bg-red-500/40 border-red-500';
          case 'missed':
            return 'bg-amber-400/30 border-amber-400';
          case 'post':
            return 'bg-orange-500/40 border-orange-500';
          default:
            return 'bg-lime-400/20 border-lime-400';
        }
      }
      return 'bg-lime-400/20 border-lime-400';
    }
    
    return readOnly 
      ? 'bg-white/[0.02] border-white/10' 
      : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] cursor-pointer';
  };

  const handleZoneClick = (zoneDir: 'left' | 'center' | 'right', zoneHeight: 'low' | 'mid' | 'high') => {
    if (!readOnly && onSelect) {
      onSelect(zoneDir, zoneHeight);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-2 aspect-3/2 border-2 border-white/20 rounded-xl p-2 bg-white/[0.02]">
        {/* Fila superior (high) */}
        {(['left', 'center', 'right'] as const).map((dir) => (
          <button
            key={`high-${dir}`}
            type="button"
            onClick={() => handleZoneClick(dir, 'high')}
            disabled={readOnly}
            className={`
              border-2 rounded-lg transition-all duration-200
              ${getZoneClass(dir, 'high')}
              ${!readOnly && 'hover:scale-105'}
            `}
            aria-label={`${t(`grid.top${dir.charAt(0).toUpperCase() + dir.slice(1)}`)}`}
          />
        ))}

        {/* Fila media (mid) */}
        {(['left', 'center', 'right'] as const).map((dir) => (
          <button
            key={`mid-${dir}`}
            type="button"
            onClick={() => handleZoneClick(dir, 'mid')}
            disabled={readOnly}
            className={`
              border-2 rounded-lg transition-all duration-200
              ${getZoneClass(dir, 'mid')}
              ${!readOnly && 'hover:scale-105'}
            `}
            aria-label={`${t(`grid.middle${dir.charAt(0).toUpperCase() + dir.slice(1)}`)}`}
          />
        ))}

        {/* Fila inferior (low) */}
        {(['left', 'center', 'right'] as const).map((dir) => (
          <button
            key={`low-${dir}`}
            type="button"
            onClick={() => handleZoneClick(dir, 'low')}
            disabled={readOnly}
            className={`
              border-2 rounded-lg transition-all duration-200
              ${getZoneClass(dir, 'low')}
              ${!readOnly && 'hover:scale-105'}
            `}
            aria-label={`${t(`grid.bottom${dir.charAt(0).toUpperCase() + dir.slice(1)}`)}`}
          />
        ))}
      </div>

      {!readOnly && (
        <p className="text-sm text-white/50 text-center mt-2">
          {t('grid.selectZone')}
        </p>
      )}

      {showResult && result && (
        <div className="mt-4 text-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getResultBadge(result)}`}>
            {t(`results.${result}`)}
          </span>
        </div>
      )}
    </div>
  );
}
