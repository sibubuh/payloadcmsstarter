import React from 'react'

export default function Hero({ siteSettings }: { siteSettings: any }) {
  return (
    <section className="relative h-svh w-full flex items-center justify-center overflow-hidden bg-slate-950">
      {/* 1. ANIMATED BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 mix-blend-screen blur-[100px] animate-morph animate-float" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 mix-blend-screen blur-[100px] animate-morph animate-float"
          style={{ animationDirection: 'reverse', animationDuration: '25s' }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-600/10 mix-blend-screen blur-[80px] animate-morph animate-float"
          style={{ animationDelay: '-5s', animationDuration: '18s' }}
        />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150" />
      </div>

      {/* 2. CONTENT */}
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Animasi Fade In Up */}
        <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Design Your Workspace <br />
            <span className="text-blue-400">With Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed">
            {siteSettings.siteDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* 3. SCROLL INDICATOR (Opsional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  )
}
