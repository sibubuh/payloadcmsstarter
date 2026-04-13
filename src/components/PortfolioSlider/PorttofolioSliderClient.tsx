'use client'
// components/PortfolioSlider/PortfolioSliderClient.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Portfolio } from '@/payload-types'
import styles from './PortfolioSlider.module.css'

interface Props {
  projects: Portfolio[]
}

const AUTOPLAY_MS = 5500

export function PortfolioSliderClient({ projects }: Props) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  const goTo = useCallback(
    (idx: number) => {
      setCurrent(((idx % projects.length) + projects.length) % projects.length)
      setProgress(0)
    },
    [projects.length],
  )

  // Autoplay + progress bar
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

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo])

  const p = projects[current]

  // Resolve cover image url from populated media relation
  const coverUrl =
    p.coverImage && typeof p.coverImage === 'object' ? (p.coverImage as any).url : null

  const categoryLabel: Record<string, string> = {
    'web-design': 'Web Design',
    'web-development': 'Web Dev',
    'mobile-app': 'Mobile App',
    branding: 'Branding',
    'ui-ux': 'UI / UX',
    ecommerce: 'E-Commerce',
    motion: 'Motion',
    other: 'Other',
  }

  return (
    <section
      className={styles.root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Portfolio slider"
    >
      {/* ── Main stage ─────────────────────────────────────── */}
      <div className={styles.stage}>
        {projects.map((proj, i) => {
          const imgUrl =
            proj.coverImage && typeof proj.coverImage === 'object'
              ? (proj.coverImage as any).url
              : null

          return (
            <div
              key={proj.id}
              className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
              aria-hidden={i !== current}
            >
              {/* Visual panel */}
              <div className={styles.visual}>
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={proj.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className={styles.coverImg}
                    priority={i === 0}
                  />
                ) : (
                  <div className={styles.coverPlaceholder}>
                    <span className={styles.placeholderInitial}>{proj.title.charAt(0)}</span>
                  </div>
                )}
                {/* Overlay category badge */}
                <span className={`${styles.catBadge} ${styles[`cat_${proj.category}`]}`}>
                  {categoryLabel[proj.category ?? ''] ?? proj.category}
                </span>
                {proj.featured && <span className={styles.featuredBadge}>★ Featured</span>}
              </div>

              {/* Content panel */}
              <div className={styles.content}>
                <div className={styles.contentInner}>
                  <p className={styles.client}>
                    {proj.client && <>{proj.client} &nbsp;·&nbsp; </>}
                    {proj.year}
                  </p>

                  <h2 className={styles.title}>{proj.title}</h2>

                  {proj.excerpt && <p className={styles.excerpt}>{proj.excerpt}</p>}

                  {/* Tech stack pills */}
                  {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                    <div className={styles.techRow}>
                      {proj.techStack.slice(0, 4).map((t: any) => (
                        <span key={t.name} className={styles.techPill}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.actions}>
                    <Link href={`/portfolio/${proj.slug}`} className={styles.btnPrimary}>
                      View case study →
                    </Link>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnGhost}
                      >
                        Live site ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Prev / Next arrows */}
        <button
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => goTo(current - 1)}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => goTo(current + 1)}
          aria-label="Next project"
        >
          →
        </button>

        {/* Slide counter */}
        <div className={styles.counter} aria-live="polite">
          {String(current + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Thumbnail strip ─────────────────────────────────── */}
      <div className={styles.thumbStrip} role="tablist" aria-label="Project thumbnails">
        {projects.map((proj, i) => {
          const tUrl =
            proj.coverImage && typeof proj.coverImage === 'object'
              ? (proj.coverImage as any).url
              : null

          return (
            <button
              key={proj.id}
              role="tab"
              aria-selected={i === current}
              className={`${styles.thumb} ${i === current ? styles.thumbActive : ''}`}
              onClick={() => goTo(i)}
            >
              <div className={styles.thumbImg}>
                {tUrl ? (
                  <Image
                    src={tUrl}
                    alt={proj.title}
                    fill
                    sizes="48px"
                    className={styles.thumbImgInner}
                  />
                ) : (
                  <div className={styles.thumbPlaceholder}>{proj.title.charAt(0)}</div>
                )}
              </div>
              <div className={styles.thumbText}>
                <span className={styles.thumbTitle}>{proj.title}</span>
                <span className={styles.thumbSub}>
                  {proj.client ?? categoryLabel[proj.category ?? '']}
                </span>
              </div>
              {/* active underline drawn via CSS */}
            </button>
          )
        })}
      </div>
    </section>
  )
}
