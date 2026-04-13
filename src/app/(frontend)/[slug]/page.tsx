// src/app/(frontend)/[slug]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { FormBlockRenderer } from '@/components/blocks/FormBlock'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { TabBlockComponent } from '@/components/blocks/TabBlock'
import { AccordionBlockComponent } from '@/components/blocks/AccordionBlock'
import type { Metadata } from 'next'

//import '../global.css'
import { HeroScrollButton } from '@/components/HeroScrollButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    select: { title: true, seo: true, coverImage: true },
  })

  if (!result.docs.length) {
    return { title: 'Page Not Found' }
  }

  const page = result.docs[0]
  const seo = page.seo || {}

  return {
    title: seo.metaTitle || page.title || 'Page',
    description: seo.metaDescription || '',
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  })

  if (!result.docs.length) notFound()

  const page = result.docs[0]

  const coverImageUrl = typeof page.coverImage === 'object' ? page.coverImage?.url : null
  const firstBlockIsHero = page.layout?.[0]?.blockType === 'hero'

  return (
    <main className="overflow-x-hidden">
      {page.layout?.map((block: any, index: number) => (
        <RenderBlock key={index} block={block} isNested={false} isFirst={index === 0} />
      ))}
    </main>
  )
}

function RenderBlock({
  block,
  isNested = false,
  isFirst = false,
}: {
  block: any
  isNested?: boolean
  isFirst?: boolean
}) {
  switch (block.blockType) {
    case 'hero': {
      const bgImage =
        block.backgroundImageUrl ||
        (typeof block.backgroundImage === 'object' ? block.backgroundImage?.url : null)

      const scrollToNext = () => {
        const nextSection = document.querySelector('main > *:nth-child(2)')
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' })
        }
      }

      return (
        <section
          className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden py-0"
          style={{
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            backgroundImage: bgImage ? `url(${bgImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: bgImage ? undefined : '#111',
          }}
        >
          {bgImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/65" />
          )}

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center animate-hero-in">
            {block.tagline && (
              <p className="text-xs tracking-widest uppercase text-white/60 mb-4">
                {block.tagline}
              </p>
            )}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {block.heading}
            </h1>
            {block.subheading && (
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
                {block.subheading}
              </p>
            )}
          </div>
        </section>
      )
    }

    case 'richText':
      if (isNested) {
        return <RichTextRenderer content={block.body} />
      }
      return (
        <section className="py-12 px-12">
          <div className="max-w-4xl mx-auto">
            <RichTextRenderer content={block.body} />
          </div>
        </section>
      )

    case 'tabs': {
      const tabEl = <TabBlockComponent tabs={block.tabs} alignment={block.alignment} />
      if (isNested) return tabEl
      return (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">{tabEl}</div>
        </section>
      )
    }

    case 'accordion': {
      const accordionEl = (
        <AccordionBlockComponent
          heading={block.heading}
          subheading={block.subheading}
          items={block.items}
          allowMultiple={block.allowMultiple}
        />
      )
      if (isNested) return accordionEl
      return (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">{accordionEl}</div>
        </section>
      )
    }

    case 'image': {
      const imageUrl = block.imageUrl || (typeof block.image === 'object' ? block.image?.url : null)
      const sizeClasses: Record<string, string> = {
        small: 'max-w-sm',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        full: 'w-full',
      }
      const alignClasses: Record<string, string> = {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto',
      }
      const figure = (
        <figure
          className={`${sizeClasses[block.size || 'full']} ${alignClasses[block.alignment || 'center']}`}
        >
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
      if (isNested) return figure
      return <section className="py-8 px-6">{figure}</section>
    }

    case 'video': {
      let videoSrc = ''
      if (block.source === 'upload' && block.videoFile) {
        videoSrc = typeof block.videoFile === 'object' ? block.videoFile?.url || '' : ''
      } else if (block.source === 'youtube' && block.embedUrl) {
        const videoId = block.embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
        videoSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : ''
      } else if (block.source === 'vimeo' && block.embedUrl) {
        const videoId = block.embedUrl.match(/vimeo\.com\/(\d+)/)?.[1]
        videoSrc = videoId ? `https://player.vimeo.com/video/${videoId}` : ''
      }
      if (!videoSrc) return null

      const videoEl = (
        <div>
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
          {block.caption && (
            <p className="mt-2 text-sm text-gray-500 text-center">{block.caption}</p>
          )}
        </div>
      )
      if (isNested) return videoEl
      return (
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">{videoEl}</div>
        </section>
      )
    }

    case 'slider': {
      const sliderEl = (
        <div className="relative overflow-hidden rounded-lg w-full">
          <div className="flex transition-transform duration-500 ease-in-out">
            {block.slides?.map((slide: any, slideIndex: number) => {
              const slideImage =
                slide.imageUrl || (typeof slide.image === 'object' ? slide.image?.url : '')
              return (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 relative"
                  style={{ aspectRatio: '16/9' }}
                >
                  {slideImage && (
                    <img
                      src={slideImage}
                      alt={slide.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {(slide.heading || slide.subheading) && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        {slide.heading && <h3 className="text-2xl font-bold">{slide.heading}</h3>}
                        {slide.subheading && <p>{slide.subheading}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
      if (isNested) return sliderEl
      return (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">{sliderEl}</div>
        </section>
      )
    }

    case 'columns': {
      const widthClass: Record<string, string> = {
        '1/4': 'w-full md:w-[calc(25%-1rem)]',
        '1/3': 'w-full md:w-[calc(33.333%-1rem)]',
        '1/2': 'w-full md:w-[calc(50%-1rem)]',
        '2/3': 'w-full md:w-[calc(66.666%-1rem)]',
        '3/4': 'w-full md:w-[calc(75%-1rem)]',
        full: 'w-full',
      }
      return (
        <section className="px-6">
          <div className="max-w-full mx-auto">
            <div className="flex flex-wrap gap-8">
              {block.columns?.map((col: any, colIndex: number) => {
                const isHexColor = col.backgroundColor?.startsWith('#')
                const bgStyle = isHexColor ? { backgroundColor: col.backgroundColor } : {}
                const bgClass = !isHexColor && col.backgroundColor ? col.backgroundColor : ''

                return (
                  <div
                    key={colIndex}
                    className={`${widthClass[col.width] ?? 'w-full'} ${col.padding || 'py-0'} ${col.textColor || ''} ${bgClass} ${col.customClass || ''} flex flex-col gap-6`}
                    style={bgStyle}
                  >
                    {col.content?.map((innerBlock: any, innerIndex: number) => (
                      <RenderBlock key={innerIndex} block={innerBlock} isNested={true} />
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )
    }

    case 'formBlock':
      return <FormBlockRenderer block={block} />

    default:
      return null
  }
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const pages = await payload.find({
    collection: 'pages',
    select: { slug: true },
  })

  return pages.docs.map((page: any) => ({ slug: page.slug }))
}
