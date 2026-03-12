// src/components/blocks/FormBlock/index.tsx
'use client'

import { useState } from 'react'
import { RichTextRenderer } from '@/components/RichTextRenderer'

export function FormBlockRenderer({ block }: { block: any }) {
  const form = block.form

  const formFields = form?.fields || []
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const submissionData = Object.entries(formData).map(([field, value]) => ({
        field,
        value,
      }))
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: form.id, submissionData }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Terjadi kesalahan, coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const hasConfirmation = form?.confirmationMessage?.root?.children?.length > 0
    return (
      <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
        {hasConfirmation ? (
          <RichTextRenderer content={form.confirmationMessage} />
        ) : (
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-700 font-semibold text-lg">
              Terima kasih! Pesan Anda telah dikirim.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full">
      {block.enableIntro && block.introContent?.root?.children?.length > 0 && (
        <div className="mb-8">
          <RichTextRenderer content={block.introContent} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {formFields.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No fields configured for this form.</p>
        ) : (
          formFields.map((field: any, i: number) => {
            if (field.blockType === 'message') {
              const hasContent = field.message?.root?.children?.length > 0
              if (!hasContent) return null
              return (
                <div key={i} className="py-2">
                  <RichTextRenderer content={field.message} />
                </div>
              )
            }

            if (field.blockType === 'textarea') {
              return (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    name={field.name}
                    required={field.required ?? false}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder={field.placeholder || ''}
                  />
                </div>
              )
            }

            if (field.blockType === 'select') {
              return (
                <div key={i} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <select
                    name={field.name}
                    required={field.required ?? false}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                  >
                    <option value="">Pilih...</option>
                    {field.options?.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (field.blockType === 'checkbox') {
              return (
                <div key={i} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name={field.name}
                    required={field.required ?? false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.checked ? 'true' : 'false',
                      }))
                    }
                    className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">{field.label}</label>
                </div>
              )
            }

            return (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={
                    field.blockType === 'email'
                      ? 'email'
                      : field.blockType === 'number'
                        ? 'number'
                        : 'text'
                  }
                  name={field.name}
                  required={field.required ?? false}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder={field.placeholder || ''}
                />
              </div>
            )
          })
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Mengirim...
            </span>
          ) : (
            form?.submitButtonLabel || 'Kirim Pesan'
          )}
        </button>
      </form>
    </div>
  )
}
