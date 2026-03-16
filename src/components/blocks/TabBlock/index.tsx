// src/components/blocks/TabBlock/index.tsx
'use client'

import React, { useState } from 'react'
import { RichTextRenderer } from '@/components/RichTextRenderer'

type TabContent = {
  blockType: string
  [key: string]: any
}

type Tab = {
  id: string
  label: string
  icon?: string
  content: TabContent[]
}

type TabBlockProps = {
  tabs: Tab[]
  style?: 'underline' | 'pills' | 'boxed'
  alignment?: 'left' | 'center' | 'right'
}

// ── Render inner block di dalam tab ──────────────
function TabInnerBlock({ block }: { block: any }) {
  switch (block.blockType) {
    case 'richText':
      return <RichTextRenderer content={block.body} />

    case 'image': {
      const imageUrl = typeof block.image === 'object' ? block.image?.url : block.image
      return (
        <figure>
          {imageUrl && (
            <img src={imageUrl} alt={block.alt || ''} className="w-full h-auto rounded-lg" />
          )}
          {block.caption && (
            <figcaption className="mt-2 text-sm text-gray-500 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'video': {
      let videoSrc = ''
      if (block.source === 'youtube' && block.embedUrl) {
        const id = block.embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
        videoSrc = id ? `https://www.youtube.com/embed/${id}` : ''
      } else if (block.source === 'vimeo' && block.embedUrl) {
        const id = block.embedUrl.match(/vimeo\.com\/(\d+)/)?.[1]
        videoSrc = id ? `https://player.vimeo.com/video/${id}` : ''
      } else if (block.source === 'upload' && block.videoFile) {
        videoSrc = typeof block.videoFile === 'object' ? block.videoFile?.url || '' : ''
      }
      if (!videoSrc) return null
      return (
        <div
          className="relative rounded-lg overflow-hidden w-full"
          style={{ aspectRatio: block.aspectRatio || '16/9' }}
        >
          <iframe
            src={videoSrc}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )
    }

    case 'slider': {
      return (
        <div className="relative overflow-hidden rounded-lg">
          <div className="flex">
            {block.slides?.map((slide: any, i: number) => {
              const url = typeof slide.image === 'object' ? slide.image?.url : ''
              return (
                <div key={i} className="w-full flex-shrink-0" style={{ aspectRatio: '16/9' }}>
                  {url && (
                    <img src={url} alt={slide.alt || ''} className="w-full h-full object-cover" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    default:
      return null
  }
}

export function TabBlockComponent({
  tabs,
  style = 'underline',
  alignment = 'left',
}: TabBlockProps) {
  const [activeTab, setActiveTab] = useState(0)

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[alignment]

  // ── Tab button styles ─────────────────────────
  const getTabClass = (isActive: boolean) => {
    if (style === 'pills') {
      return isActive
        ? 'px-5 py-2 rounded-full bg-black text-white text-sm font-semibold transition-all'
        : 'px-5 py-2 rounded-full text-gray-600 hover:bg-gray-100 text-sm font-semibold transition-all'
    }
    if (style === 'boxed') {
      return isActive
        ? 'px-5 py-3 border-t border-l border-r border-gray-200 bg-white text-black text-sm font-semibold -mb-px rounded-t-lg transition-all'
        : 'px-5 py-3 text-gray-500 hover:text-black text-sm font-semibold transition-all'
    }
    // underline (default)
    return isActive
      ? 'px-5 py-3 text-black text-sm font-semibold border-b-2 border-black transition-all'
      : 'px-5 py-3 text-gray-500 hover:text-black text-sm font-semibold border-b-2 border-transparent hover:border-gray-300 transition-all'
  }

  const containerClass = {
    underline: 'border-b border-gray-200',
    pills: 'bg-gray-50 p-1 rounded-full w-fit',
    boxed: 'border-b border-gray-200',
  }[style]

  return (
    <div className="w-full">
      {/* ── Tab Headers ────────────────────────── */}
      <div className={`flex ${alignClass} ${containerClass} mb-6 overflow-x-auto`}>
        {tabs?.map((tab, index) => (
          <button
            key={tab.id || index}
            onClick={() => setActiveTab(index)}
            className={getTabClass(activeTab === index)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────── */}
      <div>
        {tabs?.map((tab, index) => (
          <div
            key={tab.id || index}
            className={`transition-all duration-200 ${activeTab === index ? 'block' : 'hidden'}`}
          >
            {tab.content?.length > 0 ? (
              <div className="flex flex-col gap-6">
                {tab.content.map((block, blockIndex) => (
                  <TabInnerBlock key={blockIndex} block={block} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">No content in this tab.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
