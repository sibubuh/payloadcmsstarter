'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: { url?: string } | null
  publishedAt?: string | null
  tags?: Array<{ tag?: string }> | null
}

interface Props {
  posts: Post[]
}

const AUTOPLAY_MS = 5500

export function PostsSliderClient({ posts }: Props) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % posts.length) + posts.length) % posts.length)
      setProgress(0)
    },
    [posts.length],
  )

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const pct = Math.min(100, (elapsed / AUTOPLAY_MS) * 100)
      setProgress(pct)
      if (pct < 100) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    timerRef.current = setTimeout(() => goTo(current + 1), AUTOPLAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [current, paused, goTo])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo])

  const p = posts[current]
  const coverUrl = p.coverImage?.url || '/placeholder-project.jpg'
  const postTags = p.tags || []

  return (
    <section
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-8xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Posts</h2>
          </div>
          <Link
            href="/posts"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            View All Posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => {
              const imgUrl = post.coverImage?.url || '/placeholder-project.jpg'
              const isActive = i === current

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-500 ${
                    isActive ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <Image
                      src={imgUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {(post.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags?.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded-full"
                          >
                            {tag.tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => goTo(current - 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              aria-label="Previous post"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {posts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'w-8 bg-purple-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              aria-label="Next post"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            View All Posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}