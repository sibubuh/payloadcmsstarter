import { getPayload } from 'payload'
import config from '@/payload.config'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Posts | Latest Articles',
  description: 'Read our latest blog posts and articles.',
}

interface PostsPageProps {
  searchParams: Promise<{ tag?: string }>
}

const TAGS = [
  { label: 'All Posts', value: '' },
  { label: 'News', value: 'news' },
  { label: 'Tutorial', value: 'tutorial' },
  { label: 'Guide', value: 'guide' },
  { label: 'Update', value: 'update' },
]

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const where: { status: { equals: string } } = {
    status: { equals: 'published' },
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  })

  let allTags = new Set<string>()
  posts.docs.forEach((post: any) => {
    post.tags?.forEach((t: any) => {
      if (t.tag) allTags.add(t.tag)
    })
  })
  const tagList = Array.from(allTags)

  let filteredPosts = posts.docs
  if (params.tag) {
    filteredPosts = posts.docs.filter((post: any) =>
      post.tags?.some((t: any) => t.tag === params.tag)
    )
  }

  const activeTag = params.tag || ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#020617] py-24 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium px-4 py-2 rounded-full mb-6 animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Latest Articles
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Blog Posts
          </h1>

          <p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '100ms' }}
          >
            Explore our latest articles, tutorials, guides, and updates.
          </p>

          <div
            className="flex justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center gap-6 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{posts.totalDocs}</div>
                <div className="text-sm">Posts</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{tagList.length}</div>
                <div className="text-sm">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Filter by Topic</h2>
            <p className="text-gray-600">Browse posts by category</p>
          </div>

          <form method="GET" className="relative group">
            <div className="flex flex-wrap gap-2">
              {tagList.length > 0 ? (
                tagList.map((tag) => (
                  <button
                    key={tag}
                    type="submit"
                    name="tag"
                    value={tag}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                      activeTag === tag
                        ? 'bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white shadow-lg shadow-blue-900/30 scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                  >
                    {tag}
                    {activeTag === tag && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] animate-pulse opacity-40" />
                    )}
                  </button>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No tags found</span>
              )}
            </div>
          </form>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">There are no posts in this topic yet.</p>
            <a
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
            >
              View All Posts
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: any, index: number) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                publishedAt={post.publishedAt}
                tags={post.tags}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 py-20 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to stay updated?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe to our newsletter for the latest posts and updates.
          </p>
          <a
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Subscribe Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}