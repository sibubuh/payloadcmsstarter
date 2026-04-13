// components/PortfolioSlider/index.tsx
// Server component — fetches published portfolio items from Payload and passes to client slider.

import { getPayload } from 'payload'
import config from '@/payload.config'
import { PortfolioSliderClient } from './PorttofolioSliderClient'

export async function PortfolioSlider() {
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'portfolio',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 8,
    depth: 1, // resolves coverImage relation → media doc with url
  })

  if (!docs.length) return null

  return <PortfolioSliderClient projects={docs} />
}
