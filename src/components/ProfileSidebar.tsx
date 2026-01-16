'use client'

import { TravelProfile, ProfilingPhase } from '@/types'

interface ProfileSidebarProps {
  profile: TravelProfile
  phase: ProfilingPhase
}

function ProfileItem({
  icon,
  label,
  value,
  filled,
}: {
  icon: string
  label: string
  value: string | null
  filled: boolean
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
        filled ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p
          className={`text-sm font-medium truncate ${
            filled ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {value || 'En attente...'}
        </p>
      </div>
      {filled && <span className="text-green-500 text-lg">✓</span>}
    </div>
  )
}

export function ProfileSidebar({ profile, phase }: ProfileSidebarProps) {
  const completedCount = [
    profile.destination,
    profile.dates,
    profile.budget,
    profile.travelers,
    profile.vibe,
  ].filter(Boolean).length

  const progressPercent = (completedCount / 5) * 100

  return (
    <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-200 p-6">
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Votre profil voyage</h2>
        <p className="text-sm text-gray-500 mt-1">
          {phase === 'collecting' && `${completedCount}/5 informations collectées`}
          {phase === 'confirming' && 'Vérifiez vos informations'}
          {phase === 'confirmed' && 'Profil validé !'}
          {phase === 'generating' && 'Génération en cours...'}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Liste des informations */}
      <div className="space-y-3 flex-1">
        <ProfileItem
          icon="📍"
          label="Destination"
          value={profile.destination}
          filled={!!profile.destination}
        />
        <ProfileItem
          icon="📅"
          label="Dates"
          value={profile.dates}
          filled={!!profile.dates}
        />
        <ProfileItem
          icon="💰"
          label="Budget"
          value={profile.budget}
          filled={!!profile.budget}
        />
        <ProfileItem
          icon="👥"
          label="Voyageurs"
          value={profile.travelers}
          filled={!!profile.travelers}
        />
        <ProfileItem
          icon="✨"
          label="Style"
          value={profile.vibe}
          filled={!!profile.vibe}
        />
      </div>

      {/* Status */}
      {phase === 'confirmed' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xl">✓</span>
            <div>
              <p className="text-sm font-medium text-green-800">Profil confirmé</p>
              <p className="text-xs text-green-600">Prêt pour l'itinéraire</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
