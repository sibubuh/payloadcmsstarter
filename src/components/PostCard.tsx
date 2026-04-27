'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface PostCardProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: {
    url?: string
    filename?: string
  }
  publishedAt?: string
  tags?: Array<{ tag?: string }>
  index: number
}

export default function PostCard({
  id,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  tags,
  index,
}: PostCardProps) {
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

  const tagsArr = tags || []
  const imageUrl = coverImage?.url || '/placeholder-project.jpg'

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500 ease-out border border-gray-100 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link href={`/posts/${slug}`}>
        <div
          className="relative aspect-[16/9] overflow-hidden bg-gray-100 cursor-pointer"
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
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ease-out ${
              isHovered ? 'translate-y-0' : 'translate-y-4'
            }`}
          >
            {tagsArr.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tagsArr.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full"
                  >
                    {tag.tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div
            className={`absolute top-4 right-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
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
        </div>

        <div className="p-5">
          <h3
            className={`text-xl font-bold text-gray-900 transition-all duration-300 line-clamp-2 ${
              isHovered ? 'translate-x-2 text-purple-600' : ''
            }`}
          >
            {title}
          </h3>

          {excerpt && (
            <p
              className={`text-gray-600 text-sm mt-2 line-clamp-2 transition-all duration-300 delay-75 ${
                isHovered ? 'opacity-100 translate-x-2' : 'opacity-0 translate-x-4'
              }`}
            >
              {excerpt}
            </p>
          )}

          {publishedAt && (
            <div className="flex items-center gap-2 mt-4 text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
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