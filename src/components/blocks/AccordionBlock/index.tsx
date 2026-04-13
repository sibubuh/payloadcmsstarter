'use client'

import { useState } from 'react'
import { RichTextRenderer } from '@/components/RichTextRenderer'

type AccordionItem = {
  title: string
  content: any
  defaultOpen?: boolean
}

type Props = {
  heading?: string
  subheading?: string
  items: AccordionItem[]
  allowMultiple?: boolean
}

export function AccordionBlockComponent({
  heading,
  subheading,
  items = [],
  allowMultiple = false,
}: Props) {
  const defaultOpen = items.map((item, i) => (item.defaultOpen ? i : -1)).filter((i) => i !== -1)

  const [openIndices, setOpenIndices] = useState<number[]>(defaultOpen)

  function toggle(index: number) {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      )
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]))
    }
  }

  const isOpen = (index: number) => openIndices.includes(index)

  return (
    <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        {(heading || subheading) && (
          <div className="max-w-2xl mx-auto text-center">
            {heading && (
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                {heading}
              </h2>
            )}
            {subheading && <p className="mt-4 text-gray-500">{subheading}</p>}
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
          {items.map((item, index) => {
            const open = isOpen(index)

            return (
              <div
                key={index}
                className="transition-all duration-200 bg-white border border-gray-200 shadow-lg hover:bg-gray-50"
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={open}
                  className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                >
                  <span className="text-lg font-semibold text-black text-left">{item.title}</span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {open && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6 text-gray-600">
                    <RichTextRenderer content={item.content} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
