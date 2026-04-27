import { getPayload } from 'payload'
import config from '@/payload.config'
import { PostsSliderClient } from './PostsSliderClient'

export async function PostsSlider() {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 6,
    depth: 1,
  })

  if (!docs.length) return null

  const posts = docs.map((doc: any) => ({
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    coverImage: doc.coverImage?.url ? { url: doc.coverImage.url } : null,
    publishedAt: doc.publishedAt,
    tags: doc.tags,
  }))

  return <PostsSliderClient posts={posts} />
}