import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo / Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-5xl">✈️</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Agent Voyage
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          Votre assistant de voyage intelligent.
          <br />
          <span className="text-white/80">
            Créez votre itinéraire parfait en seulement 5 questions.
          </span>
        </p>

        {/* CTA Button */}
        <Link
          href="/chat"
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
        >
          Planifier mon voyage
        </Link>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-lg mb-2">Personnalisé</h3>
            <p className="text-white/80 text-sm">
              Un itinéraire adapté à vos envies et votre budget
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Rapide</h3>
            <p className="text-white/80 text-sm">
              Obtenez votre plan de voyage en quelques minutes
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-lg mb-2">Complet</h3>
            <p className="text-white/80 text-sm">
              Vols, hôtels, activités et conseils culturels inclus
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
