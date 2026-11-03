import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { UsersIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { GoalkeeperWithTeam } from '@/lib/types/database';

interface GoalkeeperCardProps {
  goalkeeper: GoalkeeperWithTeam;
  onDelete: () => void;
}

export function GoalkeeperCard({ goalkeeper, onDelete }: GoalkeeperCardProps) {
  const locale = useLocale();
  const t = useTranslations('goalkeepers');
  const tc = useTranslations('common');

  // Calcular edad si hay fecha de nacimiento
  const calculateAge = (dob: Date | undefined) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(goalkeeper.date_of_birth);
  const fullName = `${goalkeeper.first_name} ${goalkeeper.last_name}`;
  const initials = `${goalkeeper.first_name.charAt(0)}${goalkeeper.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] hover:border-lime-400/40 transition-all duration-200 overflow-hidden">
      {/* Header con foto/avatar */}
      <div className="bg-gradient-to-r from-lime-400/15 via-lime-400/5 to-transparent border-b border-white/10 p-6">
        <div className="flex items-center gap-4">
          {goalkeeper.photo ? (
            <img
              src={goalkeeper.photo}
              alt={fullName}
              className="w-20 h-20 rounded-full border-4 border-white/20 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-lime-400/15 flex items-center justify-center text-lime-300 font-black text-2xl">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-extrabold tracking-tight text-white">{fullName}</h3>
            {goalkeeper.jersey_number && (
              <p className="text-lime-300 text-lg font-extrabold">
                #{goalkeeper.jersey_number}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Equipo */}
        {goalkeeper.team_name ? (
          <div className="mb-4 flex items-center text-sm text-white/60">
            <UsersIcon className="w-4 h-4 mr-2 text-lime-400" />
            <span className="font-bold text-white/80">{goalkeeper.team_name}</span>
            {goalkeeper.team_category && (
              <span className="ml-2 text-white/40">• {goalkeeper.team_category}</span>
            )}
          </div>
        ) : (
          <div className="mb-4 flex items-center text-sm text-white/40">
            <NoSymbolIcon className="w-4 h-4 mr-2" />
            {t('noTeam')}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {age && (
            <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xl font-black text-white">{age}</p>
              <p className="text-xs text-white/40 mt-1">{t('years')}</p>
            </div>
          )}
          {goalkeeper.height && (
            <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xl font-black text-white">{goalkeeper.height}</p>
              <p className="text-xs text-white/40 mt-1">{t('cm')}</p>
            </div>
          )}
          {goalkeeper.weight && (
            <div className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <p className="text-xl font-black text-white">{goalkeeper.weight}</p>
              <p className="text-xs text-white/40 mt-1">{t('kg')}</p>
            </div>
          )}
        </div>

        {/* Mano Dominante */}
        {goalkeeper.dominant_hand && (
          <div className="mb-4 flex items-center text-sm">
            <span className="text-white/50">{t('dominantHand')}:</span>
            <span className="ml-2 font-bold text-lime-300">
              {goalkeeper.dominant_hand === 'left' && t('leftHand')}
              {goalkeeper.dominant_hand === 'right' && t('rightHand')}
              {goalkeeper.dominant_hand === 'both' && t('bothHands')}
            </span>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2">
          <Link
            href={`/${locale}/goalkeepers/${goalkeeper.id}`}
            className="flex-1 text-center px-4 py-2 bg-lime-400 text-black rounded-full hover:bg-lime-300 transition-colors text-sm font-extrabold"
          >
            {tc('view')}
          </Link>
          <Link
            href={`/${locale}/goalkeepers/${goalkeeper.id}/edit`}
            className="flex-1 text-center px-4 py-2 border border-white/15 text-white/70 rounded-full hover:border-lime-400/50 hover:text-lime-300 transition-colors text-sm font-bold"
          >
            {tc('edit')}
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2 border border-red-500/40 text-red-300 rounded-full hover:bg-red-500/10 transition-colors text-sm font-bold"
          >
            {tc('delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
