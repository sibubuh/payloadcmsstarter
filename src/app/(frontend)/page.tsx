import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import Hero from '@/components/Hero'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  //const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return <Hero siteSettings={siteSettings} />
}
