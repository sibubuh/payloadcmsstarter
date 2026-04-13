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
  alignment?: 'left' | 'center' | 'right'
}

// ── Inner Block Renderer ───────────────────────
function TabInnerBlock({ block }: { block: any }) {
  switch (block.blockType) {
    case 'richText':
      return <RichTextRenderer content={block.body} />

    case 'image': {
      const imageUrl = typeof block.image === 'object' ? block.image?.url : block.image
      return (
        <figure>
          {imageUrl && (
            <img src={imageUrl} alt={block.alt || ''} className="w-full h-auto rounded-xl" />
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
          className="relative rounded-xl overflow-hidden w-full shadow-sm"
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

    default:
      return null
  }
}

export function TabBlockComponent({ tabs, alignment = 'center' }: TabBlockProps) {
  const [activeTab, setActiveTab] = useState(0)

  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[alignment]

  return (
    <div className="w-full">
      {/* ── Modern Tabs Header ───────────────── */}
      <div className={`flex ${alignClass}`}>
        <div className="relative flex gap-1 p-1 bg-gray-100/70 backdrop-blur rounded-2xl shadow-inner">
          {/* Sliding Background */}
          <div
            className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300"
            style={{
              width: `calc(100% / ${tabs.length})`,
              transform: `translateX(${activeTab * 100}%)`,
            }}
          />

          {tabs?.map((tab, index) => {
            const isActive = activeTab === index

            return (
              <button
                key={tab.id || index}
                onClick={() => setActiveTab(index)}
                className={`relative z-10 px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ─────────────────────────── */}
      <div className="relative mt-8">
        {tabs?.map((tab, index) => {
          const isActive = activeTab === index

          return (
            <div
              key={tab.id || index}
              className={`transition-all duration-300 ease-out ${
                isActive
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-3 scale-[0.98] absolute inset-0 pointer-events-none'
              }`}
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
          )
        })}
      </div>
    </div>
  )
}
