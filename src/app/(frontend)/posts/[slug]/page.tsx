import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import ShareButton from '@/components/ShareButton'
import type { Metadata } from 'next'

interface PostDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const post = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
  })

  if (!post.docs[0]) {
    return { title: 'Post Not Found' }
  }

  const doc = post.docs[0] as any

  return {
    title: doc.seo?.metaTitle || doc.title,
    description: doc.seo?.metaDescription || doc.excerpt,
    openGraph: {
      title: doc.seo?.metaTitle || doc.title,
      description: doc.seo?.metaDescription || doc.excerpt,
      images: doc.seo?.ogImage?.url ? [doc.seo.ogImage.url] : doc.coverImage?.url ? [doc.coverImage.url] : [],
    },
  }
}

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 100,
  })

  return posts.docs.map((doc: any) => ({ slug: doc.slug }))
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const post = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 2,
  })

  if (!post.docs[0]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/posts" className="text-purple-600 hover:underline">
            Back to Posts
          </Link>
        </div>
      </div>
    )
  }

  const doc = post.docs[0] as any

  const allTags: string[] = []
  const relatedPosts = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      id: { not_equals: doc.id },
    },
    limit: 3,
    depth: 1,
  })

  const coverImageUrl = doc.coverImage?.url

  return (
    <div className="min-h-screen bg-white">
      {coverImageUrl ? (
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
                  href="/posts"
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
                  Posts
                </Link>
                <span className="text-white/50">/</span>
                {doc.tags?.length > 0 && (
                  <span className="text-white font-medium">
                    {doc.tags[0]?.tag}
                  </span>
                )}
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
      ) : (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617] py-24 md:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-8xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Posts
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {doc.title}
            </h1>

            {doc.excerpt && (
              <p className="text-xl text-gray-300 max-w-3xl">
                {doc.excerpt}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <main className="lg:col-span-2">
            {doc.content && (
              <article className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <RichTextRenderer content={doc.content} />
              </article>
            )}
          </main>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Post Details</h3>

              <dl className="space-y-4">
                {doc.publishedAt && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Published</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(doc.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                )}

                {doc.author && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Author</dt>
                    <dd className="font-medium text-gray-900">
                      {typeof doc.author === 'object' ? doc.author.email : 'Unknown'}
                    </dd>
                  </div>
                )}

                {doc.tags?.length > 0 && (
                  <div className="pt-2">
                    <dt className="text-gray-500 text-sm mb-3">Tags</dt>
                    <dd className="flex flex-wrap gap-2">
                      {doc.tags.map((tag: any, index: number) => (
                        <Link
                          key={index}
                          href={`/posts?tag=${tag.tag}`}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full hover:bg-purple-200 transition-colors"
                        >
                          {tag.tag}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Share this post</h4>
                <div className="flex gap-3">
                  <ShareButton title={doc.title} url={`/posts/${doc.slug}`} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedPosts.docs.length > 0 && (
          <section className="py-16 border-t border-gray-100 mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-900">Related Posts</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.docs.map((related: any, index: number) => (
                <Link
                  key={related.id}
                  href={`/posts/${related.slug}`}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {related.coverImage?.url && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={related.coverImage.url}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    )}
                    {related.publishedAt && (
                      <p className="text-gray-400 text-xs mt-3">
                        {new Date(related.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="bg-gray-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Want to read more?</h3>
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}