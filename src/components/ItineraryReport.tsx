'use client'

import { ItineraryData, TravelProfile } from '@/types'

interface ItineraryReportProps {
  itinerary: ItineraryData
  profile: TravelProfile
}

export default function ItineraryReport({ itinerary, profile }: ItineraryReportProps) {
  const { culture, flights, hotels, activities } = itinerary

  // Calculer le budget estimatif global
  const calculateBudget = () => {
    let minTotal = 0
    let maxTotal = 0

    // Vols
    const flightPriceMatch = flights.prix.match(/(\d+)[^\d]*(\d+)?/)
    if (flightPriceMatch) {
      const min = parseInt(flightPriceMatch[1]) || 0
      const max = parseInt(flightPriceMatch[2]) || min
      minTotal += min
      maxTotal += max
    }

    // Hôtels (estimation pour 5 nuits par défaut)
    const nights = 5
    hotels.hotels.forEach((hotel) => {
      const priceMatch = hotel.prix.match(/(\d+)/)
      if (priceMatch) {
        const pricePerNight = parseInt(priceMatch[1])
        minTotal += pricePerNight * nights
        maxTotal += pricePerNight * nights
      }
    })

    // Activités
    activities.activites.forEach((act) => {
      const priceMatch = act.prix.match(/(\d+)/)
      if (priceMatch) {
        minTotal += parseInt(priceMatch[1])
        maxTotal += parseInt(priceMatch[1])
      }
    })

    // Restaurants (estimation)
    activities.restaurants.forEach((resto) => {
      const priceMatch = resto.prix.match(/(\d+)[^\d]*(\d+)?/)
      if (priceMatch) {
        const min = parseInt(priceMatch[1]) || 0
        const max = parseInt(priceMatch[2]) || min
        minTotal += min * nights
        maxTotal += max * nights
      }
    })

    if (minTotal === 0 && maxTotal === 0) {
      return 'Budget à calculer selon vos choix'
    }

    // Diviser par 3 car on a 3 options d'hôtels
    minTotal = Math.round(minTotal / 3)
    maxTotal = Math.round(maxTotal / 3)

    return `${minTotal} - ${maxTotal}€`
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">
          Votre itinéraire pour {profile.destination}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          <span>{profile.dates}</span>
          <span>•</span>
          <span>{profile.travelers}</span>
          <span>•</span>
          <span>Budget {profile.budget}</span>
          <span>•</span>
          <span>Style {profile.vibe}</span>
        </div>
      </div>

      {/* Section Culture */}
      {culture.success && (
        <section className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌍</span>
            <h2 className="text-xl font-semibold text-gray-800">Contexte culturel</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">{culture.content}</p>
        </section>
      )}

      {/* Section Vols */}
      {flights.success && (
        <section className="p-6 border-b bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✈️</span>
            <h2 className="text-xl font-semibold text-gray-800">Vols</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Période recommandée</p>
              <p className="font-medium text-gray-800">{flights.periode}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Prix estimé A/R</p>
              <p className="font-medium text-blue-600">{flights.prix}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Compagnies</p>
              <p className="font-medium text-gray-800">{flights.compagnies}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Conseil</p>
              <p className="font-medium text-gray-800">{flights.conseil}</p>
            </div>
          </div>
        </section>
      )}

      {/* Section Hôtels */}
      {hotels.success && hotels.hotels.length > 0 && (
        <section className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🏨</span>
            <h2 className="text-xl font-semibold text-gray-800">Hébergements</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {hotels.hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {hotel.type}
                  </span>
                  <span className="font-bold text-blue-600">{hotel.prix}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{hotel.nom}</h3>
                <p className="text-sm text-gray-500 mb-2">{hotel.quartier}</p>
                <p className="text-xs text-gray-600">{hotel.points_forts}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section Activités */}
      {activities.success && (
        <section className="p-6 border-b bg-green-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-semibold text-gray-800">Activités</h2>
          </div>
          <div className="space-y-3">
            {activities.activites.map((activity, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{activity.nom}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm font-medium text-green-600 whitespace-nowrap ml-4">
                  {activity.prix}
                </span>
              </div>
            ))}
          </div>

          {/* Restaurants */}
          {activities.restaurants.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🍽️</span>
                <h3 className="font-semibold text-gray-800">Restaurants recommandés</h3>
              </div>
              <div className="space-y-3">
                {activities.restaurants.map((resto, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{resto.nom}</h4>
                      <p className="text-sm text-gray-600">{resto.description}</p>
                    </div>
                    <span className="text-sm font-medium text-orange-600 whitespace-nowrap ml-4">
                      {resto.prix}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conseil */}
          {activities.conseil && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">💡 Conseil :</span> {activities.conseil}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Budget estimatif global */}
      <section className="p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Budget estimatif total</h2>
            <p className="text-sm opacity-80">Par personne, vol + hébergement + activités</p>
          </div>
          <div className="text-3xl font-bold">{calculateBudget()}</div>
        </div>
      </section>

      {/* Footer */}
      <div className="p-4 bg-gray-100 text-center text-sm text-gray-500">
        <p>
          Ces estimations sont indicatives. Les prix peuvent varier selon la période de réservation.
        </p>
      </div>
    </div>
  )
}
