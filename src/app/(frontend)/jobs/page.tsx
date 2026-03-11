import { getPayload } from 'payload'
import { fileURLToPath } from 'url'
import config from '@/payload.config'
import Link from 'next/link'

const DEPARTMENTS = [
  { label: 'All Departments', value: '' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Sales', value: 'sales' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
  { label: 'Design', value: 'design' },
  { label: 'Product', value: 'product' },
  { label: 'Customer Success', value: 'customer-success' },
]

const JOB_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
]

function getJobTypeLabel(value: string) {
  return JOB_TYPES.find((t) => t.value === value)?.label || value
}

function getDepartmentLabel(value: string) {
  return DEPARTMENTS.find((d) => d.value === value)?.label || value
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string; jobType?: string }>
}) {
  const params = await searchParams
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const where: {
    status: { equals: string }
    department?: { equals: string }
    jobType?: { equals: string }
  } = {
    status: { equals: 'published' },
  }

  if (params.department) {
    where.department = { equals: params.department }
  }
  if (params.jobType) {
    where.jobType = { equals: params.jobType }
  }

  const jobs = await payload.find({
    collection: 'jobs',
    where,
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Career Opportunities</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Join our team and help us build amazing things
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}
      >
        <form method="GET" style={{ display: 'contents' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Department
            </label>
            <select
              name="department"
              defaultValue={params.department || ''}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Job Type
            </label>
            <select
              name="jobType"
              defaultValue={params.jobType || ''}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              {JOB_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {jobs.docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>No job openings available at the moment.</p>
          <p>Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {jobs.docs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.slug}`}
              style={{
                display: 'block',
                padding: '1.5rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{job.title}</h2>
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      color: '#666',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>{getDepartmentLabel(job.department)}</span>
                    <span>•</span>
                    <span>{getJobTypeLabel(job.jobType)}</span>
                    {job.location && (
                      <>
                        <span>•</span>
                        <span>{job.location}</span>
                      </>
                    )}
                    {job.remoteType && (
                      <>
                        <span>•</span>
                        <span style={{ textTransform: 'capitalize' }}>{job.remoteType}</span>
                      </>
                    )}
                  </div>
                </div>
                {job.featured && (
                  <span
                    style={{
                      backgroundColor: '#ffc107',
                      color: '#000',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    FEATURED
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
