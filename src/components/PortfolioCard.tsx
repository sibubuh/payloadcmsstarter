'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface PortfolioCardProps {
  id: string
  title: string
  slug: string
  category: string
  excerpt?: string
  coverImage?: {
    url?: string
    filename?: string
  }
  featured?: boolean
  year?: number
  index: number
}

const CATEGORY_LABELS: Record<string, string> = {
  'web-design': 'Web Design',
  'web-development': 'Web Development',
  'mobile-app': 'Mobile App',
  branding: 'Branding & Identity',
  'ui-ux': 'UI/UX Design',
  ecommerce: 'E-Commerce',
  motion: 'Motion & Animation',
  other: 'Other',
}

const CATEGORY_COLORS: Record<string, string> = {
  'web-design': 'bg-purple-500',
  'web-development': 'bg-blue-500',
  'mobile-app': 'bg-green-500',
  branding: 'bg-blue-500',
  'ui-ux': 'bg-orange-500',
  ecommerce: 'bg-cyan-500',
  motion: 'bg-red-500',
  other: 'bg-gray-500',
}

export default function PortfolioCard({
  id,
  title,
  slug,
  category,
  excerpt,
  coverImage,
  featured,
  year,
  index,
}: PortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [index])

  const categoryLabel = CATEGORY_LABELS[category] || category
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-500'
  const imageUrl = coverImage?.url || '/placeholder-project.jpg'

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link href={`/portfolio/${slug}`}>
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer ${
            featured ? 'aspect-[16/9]' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-60'
            }`}
          />

          <div
            className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ease-out ${
              isHovered ? 'translate-y-0' : 'translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`${categoryColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
              >
                {categoryLabel}
              </span>
              {featured && (
                <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Featured
                </span>
              )}
            </div>
            <h3
              className={`text-white text-xl md:text-2xl font-bold transition-all duration-300 ${
                isHovered ? 'translate-x-2' : ''
              }`}
            >
              {title}
            </h3>
            {excerpt && (
              <p
                className={`text-gray-200 text-sm mt-2 line-clamp-2 transition-all duration-300 delay-75 ${
                  isHovered ? 'opacity-100 translate-x-2' : 'opacity-0 translate-x-4'
                }`}
              >
                {excerpt}
              </p>
            )}
          </div>

          <div
            className={`absolute top-4 right-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>

          {year && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1 rounded-lg">
              {year}
            </div>
          )}
        </div>
      </Link>

      <div
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full transition-all duration-500 ${
          isHovered ? 'w-3/4' : 'w-0'
        }`}
      />
    </div>
  )
}
