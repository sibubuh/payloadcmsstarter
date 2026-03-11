import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const JOB_TYPES: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
}

const DEPARTMENTS: Record<string, string> = {
  engineering: 'Engineering',
  marketing: 'Marketing',
  sales: 'Sales',
  hr: 'Human Resources',
  finance: 'Finance',
  operations: 'Operations',
  design: 'Design',
  product: 'Product',
  'customer-success': 'Customer Success',
  other: 'Other',
}

function formatSalary(
  salary: { min?: number | null; max?: number | null; currency?: string | null } | null,
) {
  if (!salary?.min && !salary?.max) return null
  const currency = salary.currency || 'IDR'
  const format = (n: number) =>
    currency === 'IDR' ? n.toLocaleString('id-ID') : n.toLocaleString('en-US')

  const min = salary.min ?? undefined
  const max = salary.max ?? undefined

  if (min && max) return `${currency} ${format(min)} - ${format(max)}`
  if (min) return `From ${currency} ${format(min)}`
  return max ? `Up to ${currency} ${format(max)}` : null
}

function RichTextContent({ content }: { content: unknown }) {
  const richContent = content as { root?: { children?: unknown[] } }
  if (!richContent?.root?.children?.length) return null

  return (
    <div style={{ lineHeight: 1.7 }}>
      {richContent.root.children!.map((child: unknown, index: number) => {
        const node = child as {
          type: string
          children?: { type: string; text?: string }[]
          text?: string
        }

        if (node.type === 'paragraph') {
          return (
            <p key={index} style={{ marginBottom: '1rem' }}>
              {node.children?.map((c, i) => <span key={i}>{c.text || ''}</span>) || ''}
            </p>
          )
        }

        if (node.type === 'heading') {
          return (
            <h3 key={index} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              {node.children?.map((c) => c.text || '')}
            </h3>
          )
        }

        if (node.type === 'list') {
          return (
            <ul key={index} style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              {node.children?.map((li: unknown, i: number) => {
                const listItem = li as { children?: { text?: string }[] }
                return <li key={i}>{listItem.children?.map((c) => c.text || '')}</li>
              })}
            </ul>
          )
        }

        return null
      })}
    </div>
  )
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const job = await payload.find({
    collection: 'jobs',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  if (!job.docs.length) {
    notFound()
  }

  const jobData = job.docs[0]

  const applyFormId = jobData.applyForm
    ? typeof jobData.applyForm === 'object'
      ? (jobData.applyForm as { id: string | number }).id
      : jobData.applyForm
    : null

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <Link
        href="/jobs"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          color: '#666',
          textDecoration: 'none',
        }}
      >
        ← Back to Jobs
      </Link>

      <div
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          padding: '2rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          {jobData.featured && (
            <span
              style={{
                backgroundColor: '#ffc107',
                color: '#000',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
                display: 'inline-block',
              }}
            >
              FEATURED
            </span>
          )}
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>{jobData.title}</h1>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '1.5rem',
            color: '#666',
          }}
        >
          <span>{DEPARTMENTS[jobData.department] || jobData.department}</span>
          <span>•</span>
          <span>{JOB_TYPES[jobData.jobType] || jobData.jobType}</span>
          {jobData.location && (
            <>
              <span>•</span>
              <span>{jobData.location}</span>
            </>
          )}
          {jobData.remoteType && (
            <>
              <span>•</span>
              <span style={{ textTransform: 'capitalize' }}>{jobData.remoteType}</span>
            </>
          )}
          {jobData.salaryRange && formatSalary(jobData.salaryRange) && (
            <>
              <span>•</span>
              <span>{formatSalary(jobData.salaryRange)}</span>
            </>
          )}
        </div>

        {jobData.description && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Job Description</h2>
            <RichTextContent content={jobData.description as unknown} />
          </section>
        )}

        {jobData.requirements && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Requirements</h2>
            <RichTextContent content={jobData.requirements as unknown} />
          </section>
        )}

        {jobData.benefits && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Benefits</h2>
            <RichTextContent content={jobData.benefits as unknown} />
          </section>
        )}

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e0e0e0',
          }}
        >
          {applyFormId ? (
            <Link
              href={`/form-submissions/${applyFormId}`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#333',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 500,
              }}
            >
              Apply Now
            </Link>
          ) : (
            <p style={{ color: '#666' }}>No application form available for this position.</p>
          )}
        </div>
      </div>
    </div>
  )
}
