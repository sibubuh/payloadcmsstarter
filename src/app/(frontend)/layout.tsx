import React from 'react'
import './styles.css'
import Header from '@/components/Header'
import { getPayload } from 'payload'
import config from '@/payload.config'

import type { Metadata } from 'next'
import Hero from '@/components/Hero'

export async function generateMetadata(): Promise<Metadata> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const siteSettings = (await payload.findGlobal({ slug: 'site-settings', depth: 1 })) as any
    const defaultSeo = siteSettings?.defaultSeo || {}

    return {
      title: defaultSeo?.metaTitle || siteSettings?.siteName || 'Payload Blank Template',
      description:
        defaultSeo?.metaDescription ||
        siteSettings?.siteDescription ||
        'A blank template using Payload in a Next.js app.',
    }
  } catch (error) {
    return {
      title: 'Payload Blank Template',
      description: 'A blank template using Payload in a Next.js app.',
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const headerData = await payload.findGlobal({ slug: 'header', depth: 1 })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })

  return (
    <html lang="en">
      <body>
        <Header headerData={headerData} siteSettings={siteSettings} />
        <main>{children}</main>
      </body>
    </html>
  )
}
