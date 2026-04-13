import { getPayload } from 'payload'
import config from '@/payload.config'
import PortfolioCard from '@/components/PortfolioCard'
import type { Metadata } from 'next'

const CATEGORIES = [
  { label: 'All Projects', value: '' },
  { label: 'Web Design', value: 'web-design' },
  { label: 'Web Development', value: 'web-development' },
  { label: 'Mobile App', value: 'mobile-app' },
  { label: 'Branding & Identity', value: 'branding' },
  { label: 'UI/UX Design', value: 'ui-ux' },
  { label: 'E-Commerce', value: 'ecommerce' },
  { label: 'Motion & Animation', value: 'motion' },
  { label: 'Other', value: 'other' },
]

export const metadata: Metadata = {
  title: 'Portfolio | My Work',
  description: 'Explore my portfolio of web design, development, and creative projects.',
}

interface PortfolioPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const where: { status: { equals: string }; category?: { equals: string } } = {
    status: { equals: 'published' },
  }

  if (params.category) {
    where.category = { equals: params.category }
  }

  const portfolio = await payload.find({
    collection: 'portfolio',
    where,
    sort: '-featured,-createdAt',
    limit: 100,
    depth: 1,
  })

  const featuredProjects = portfolio.docs.filter((p: any) => p.featured)
  const otherProjects = portfolio.docs.filter((p: any) => !p.featured)
  const activeCategory = params.category || ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            My Creative Work
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Portfolio
          </h1>

          <p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '100ms' }}
          >
            A curated collection of my work spanning web design, development, branding, and creative
            projects.
          </p>

          <div
            className="flex justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center gap-6 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{portfolio.totalDocs}</div>
                <div className="text-sm">Projects</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{CATEGORIES.length - 1}</div>
                <div className="text-sm">Categories</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Filter Projects</h2>
            <p className="text-gray-600">Browse projects by category</p>
          </div>

          <form method="GET" className="relative group">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="submit"
                  name="category"
                  value={cat.value}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {cat.label}
                  {activeCategory === cat.value && (
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-50" />
                  )}
                </button>
              ))}
            </div>
          </form>
        </div>

        {featuredProjects.length > 0 && !params.category && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Projects</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredProjects.map((project: any, index: number) => (
                <PortfolioCard
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  slug={project.slug}
                  category={project.category}
                  excerpt={project.excerpt}
                  coverImage={project.coverImage}
                  featured={project.featured}
                  year={project.year}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {(otherProjects.length > 0 || params.category) && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {params.category
                  ? CATEGORIES.find((c) => c.value === params.category)?.label || 'Projects'
                  : 'All Projects'}
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full" />
            </div>

            {portfolio.docs.length === 0 ? (
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">There are no projects in this category yet.</p>
                <a
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors"
                >
                  View All Projects
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.docs.map((project: any, index: number) => (
                  <PortfolioCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    slug={project.slug}
                    category={project.category}
                    excerpt={project.excerpt}
                    coverImage={project.coverImage}
                    featured={project.featured}
                    year={project.year}
                    index={index + (params.category ? 0 : featuredProjects.length)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <section className="bg-gradient-to-br from-purple-900 via-pink-900 to-slate-900 py-20 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            I&apos;m always open to discussing new projects and creative ideas.
          </p>
          <a
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <span>Let&apos;s Talk</span>
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
