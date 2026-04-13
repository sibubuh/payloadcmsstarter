import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import PortfolioGallery from '@/components/PortfolioGallery'
import type { Metadata } from 'next'

interface PortfolioDetailPageProps {
  params: Promise<{ slug: string }>
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

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const project = await payload.find({
    collection: 'portfolio',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
  })

  if (!project.docs[0]) {
    return { title: 'Project Not Found' }
  }

  const doc = project.docs[0]

  return {
    title: (doc as any).seo?.metaTitle || (doc as any).title,
    description: (doc as any).seo?.metaDescription || (doc as any).excerpt,
    openGraph: {
      title: (doc as any).seo?.metaTitle || (doc as any).title,
      description: (doc as any).seo?.metaDescription || (doc as any).excerpt,
      images: (doc as any).seo?.ogImage?.url ? [(doc as any).seo.ogImage.url] : [],
    },
  }
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const projects = await payload.find({
    collection: 'portfolio',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 100,
  })

  return projects.docs.map((doc: any) => ({ slug: doc.slug }))
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const project = await payload.find({
    collection: 'portfolio',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
  })

  if (!project.docs[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/portfolio" className="text-purple-600 hover:underline">
            Back to Portfolio
          </Link>
        </div>
      </div>
    )
  }

  const doc = project.docs[0] as any

  const relatedProjects = await payload.find({
    collection: 'portfolio',
    where: {
      status: { equals: 'published' },
      category: { equals: doc.category },
      id: { not_equals: doc.id },
    },
    limit: 3,
    depth: 1,
  })

  const coverImageUrl = doc.coverImage?.url || '/placeholder-project.jpg'
  const categoryLabel = CATEGORY_LABELS[doc.category] || doc.category

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
        <Image
          src={coverImageUrl}
          alt={doc.title}
          fill
          className="object-cover scale-105 animate-slow-zoom"
          priority
          sizes="100vw"
        />

        <div className="absolute inset-0 z-20 flex items-end">
          <div className="max-w-8xl mx-auto px-6 pb-12 md:pb-20 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Portfolio
              </Link>
              <span className="text-white/50">/</span>
              <span className="text-white font-medium">{categoryLabel}</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: '100ms' }}
            >
              {doc.title}
            </h1>

            {doc.excerpt && (
              <p
                className="text-xl text-gray-200 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: '200ms' }}
              >
                {doc.excerpt}
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-20" />
      </div>

      <div className="max-w-8xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-8 relative z-30">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>

              <dl className="space-y-4">
                {doc.category && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Category</dt>
                    <dd className="font-medium text-gray-900">{categoryLabel}</dd>
                  </div>
                )}

                {doc.client && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Client</dt>
                    <dd className="font-medium text-gray-900">{doc.client}</dd>
                  </div>
                )}

                {doc.year && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Year</dt>
                    <dd className="font-medium text-gray-900">{doc.year}</dd>
                  </div>
                )}

                {doc.tags?.length > 0 && (
                  <div className="pt-2">
                    <dt className="text-gray-500 text-sm mb-3">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {doc.tags.map((tag: any, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full"
                        >
                          {tag.tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 space-y-3">
                {doc.projectUrl && (
                  <a
                    href={doc.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Live Project
                  </a>
                )}

                {doc.repositoryUrl && (
                  <a
                    href={doc.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    View Code
                  </a>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2 -mt-16">
            {doc.content && (
              <section className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
                <RichTextRenderer content={doc.content} />
              </section>
            )}

            {doc.gallery?.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Project Gallery</h2>
                </div>
                <PortfolioGallery images={doc.gallery} />
              </section>
            )}

            {doc.techStack?.length > 0 && (
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <h2 className="text-2xl font-bold text-gray-900">Tech Stack</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doc.techStack.map((tech: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white p-4 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{tech.name}</h4>
                        {tech.role && <p className="text-sm text-gray-500">{tech.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {doc.testimonial?.quote && (
              <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-slate-900 rounded-2xl p-8 md:p-12 mb-12 text-white">
                <div className="text-6xl text-purple-400/50 mb-4">&ldquo;</div>
                <blockquote className="text-xl md:text-2xl italic leading-relaxed mb-8">
                  {doc.testimonial.quote}
                </blockquote>
                <div className="flex items-center gap-4">
                  {doc.testimonial.avatar?.url && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                      <Image
                        src={doc.testimonial.avatar.url}
                        alt={doc.testimonial.author || 'Client'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg">{doc.testimonial.author}</div>
                    {doc.testimonial.authorTitle && (
                      <div className="text-white/70">{doc.testimonial.authorTitle}</div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>

        {relatedProjects.docs.length > 0 && (
          <section className="py-16 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Related Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.docs.map((related: any, index: number) => (
                <Link
                  key={related.id}
                  href={`/portfolio/${related.slug}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={related.coverImage?.url || '/placeholder.jpg'}
                    alt={related.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold">{related.title}</h3>
                    <p className="text-white/70 text-sm">
                      {CATEGORY_LABELS[related.category] || related.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Want to see more?</h3>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            View All Projects
          </Link>
        </div>
      </div>
    </div>
  )
}
