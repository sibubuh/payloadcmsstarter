'use client'

const BelowHero = () => {
  return (
    <section className="bg-[#f5f5f5] py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Title */}
        <div>
          <h1 className="font-serif italic text-[48px] md:text-[72px] leading-tight text-[#0b0f19]">
            Results Driven <br /> Agency
          </h1>
        </div>

        {/* Right Content */}
        <div className="max-w-xl">
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            We are experts in commercializing your ideas into powerful strategy that will elevate
            and scale up your brands and businesses
          </p>

          <button className="mt-6 text-[#5f8f82] font-semibold tracking-wide uppercase text-sm hover:opacity-80 transition">
            Get to know us
          </button>
        </div>
      </div>
    </section>
  )
}

export default BelowHero
