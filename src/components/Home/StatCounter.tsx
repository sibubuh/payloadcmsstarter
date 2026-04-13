'use client'

import { useEffect, useRef, useState } from 'react'

type CounterProps = {
  end: number
  duration?: number
  suffix?: string
}

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: CounterProps) => {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = timestamp - startTimeRef.current

      const percentage = Math.min(progress / duration, 1)
      const value = Math.floor(percentage * end)

      setCount(value)

      if (percentage < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

const StatsCounter = () => {
  return (
    <div className="min-h-full grid xl:grid-flow-col xl:grid-cols-3 grid-flow-row justify-center gap-20 py-36 xl:px-32 px-10 max-w-6xl mx-auto my-16 md:mb-32">
      {/* Projects */}
      <div>
        <h2 className="text-5xl font-serif italic">
          <AnimatedCounter end={3000} suffix="+" />
        </h2>
        <div className="w-24 h-[1px] bg-black mx-auto my-4" />
        <p className="italic text-lg">Completed Projects</p>
      </div>

      {/* Clients */}
      <div>
        <h2 className="text-5xl font-serif italic">
          <AnimatedCounter end={700} suffix="+" />
        </h2>
        <div className="w-24 h-[1px] bg-black mx-auto my-4" />
        <p className="italic text-lg">Clients</p>
      </div>

      {/* Videos */}
      <div>
        <h2 className="text-5xl font-serif italic">
          <AnimatedCounter end={15000} suffix="++" />
        </h2>
        <div className="w-24 h-[1px] bg-black mx-auto my-4" />
        <p className="italic text-lg">Videos Produced</p>
      </div>
    </div>
  )
}

export default StatsCounter
