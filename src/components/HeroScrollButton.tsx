'use client'

export function HeroScrollButton() {
  const scrollToNext = () => {
    const nextSection = document.querySelector('main > *:nth-child(2)')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={scrollToNext}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 hover:text-white transition"
      aria-label="Scroll to next section"
    >
      <span className="text-xs tracking-widest uppercase">Scroll</span>

      <div className="animate-bounce">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  )
}
