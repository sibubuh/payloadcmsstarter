// src/components/RichTextRenderer.tsx
import React from 'react'

// ── Lexical format bitmask ────────────────────────
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

// ── Render satu text node dengan formatting ───────
function LexicalText({ node }: { node: any }) {
  if (node.text === undefined || node.text === null) return null
  if (node.text === '') return <span>&nbsp;</span>

  let content: React.ReactNode = node.text

  // cek setiap format dengan bitmask
  if (node.format & IS_CODE)
    content = (
      <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">
        {content}
      </code>
    )
  if (node.format & IS_BOLD) content = <strong className="font-bold">{content}</strong>
  if (node.format & IS_ITALIC) content = <em className="italic">{content}</em>
  if (node.format & IS_UNDERLINE) content = <u className="underline">{content}</u>
  if (node.format & IS_STRIKETHROUGH) content = <s className="line-through">{content}</s>
  if (node.format & IS_SUBSCRIPT) content = <sub>{content}</sub>
  if (node.format & IS_SUPERSCRIPT) content = <sup>{content}</sup>

  return <>{content}</>
}

// ── Render satu node (rekursif) ───────────────────
function LexicalNode({ node }: { node: any }): React.ReactElement | null {
  switch (node.type) {
    case 'text':
      return <LexicalText node={node} />

    case 'linebreak':
      return <br />

    case 'paragraph': {
      const isEmpty =
        !node.children?.length || node.children.every((c: any) => !c.text && c.type !== 'linebreak')

      if (isEmpty) return <p className="mb-2">&nbsp;</p>

      return (
        <p className="mb-4 leading-relaxed">
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </p>
      )
    }

    case 'heading': {
      const tag = node.tag || 'h2'
      const classes: Record<string, string> = {
        h1: 'text-4xl font-bold mb-6 mt-8 leading-tight',
        h2: 'text-3xl font-bold mb-4 mt-6 leading-tight',
        h3: 'text-2xl font-semibold mb-3 mt-5',
        h4: 'text-xl font-semibold mb-2 mt-4',
        h5: 'text-lg font-medium mb-2 mt-3',
        h6: 'text-base font-medium mb-2 mt-3',
      }
      const Tag = tag as keyof JSX.IntrinsicElements
      return (
        <Tag className={classes[tag] || 'font-bold mb-4'}>
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </Tag>
      )
    }

    case 'list': {
      const isOrdered = node.listType === 'number'
      const Tag = isOrdered ? 'ol' : 'ul'
      return (
        <Tag className={`mb-4 pl-6 space-y-1 ${isOrdered ? 'list-decimal' : 'list-disc'}`}>
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li className="leading-relaxed">
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </li>
      )

    case 'link': {
      const fields = node.fields || {}
      let href = '#'
      if (fields.linkType === 'internal' && fields.doc?.value?.slug) {
        href = `/${fields.doc.value.slug}`
      } else if (fields.url) {
        href = fields.url
      } else if (node.url) {
        href = node.url
      }
      const newTab = fields.newTab === true

      return (
        <a
          href={href}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </a>
      )
    }

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4 my-4">
          {node.children?.map((child: any, i: number) => (
            <LexicalNode key={i} node={child} />
          ))}
        </blockquote>
      )

    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
          <code>
            {node.children?.map((child: any, i: number) => (
              <LexicalNode key={i} node={child} />
            ))}
          </code>
        </pre>
      )

    case 'upload': {
      const url = typeof node.value === 'object' ? node.value?.url : null
      const alt = typeof node.value === 'object' ? node.value?.alt || '' : ''
      if (!url) return null
      return (
        <figure className="mb-4">
          <img src={url} alt={alt} className="w-full h-auto rounded-lg" />
        </figure>
      )
    }

    default:
      // fallback — render children kalau ada
      if (node.children?.length) {
        return (
          <>
            {node.children.map((child: any, i: number) => (
              <LexicalNode key={i} node={child} />
            ))}
          </>
        )
      }
      return null
  }
}

// ── Main export ───────────────────────────────────
export function RichTextRenderer({ content }: { content: any }) {
  if (!content?.root?.children?.length) return null

  return (
    <div className="prose prose-lg max-w-none">
      {content.root.children.map((node: any, index: number) => (
        <LexicalNode key={index} node={node} />
      ))}
    </div>
  )
}
