'use client'

import dynamic from 'next/dynamic'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

// Dynamically import RichText with SSR disabled to prevent build errors
// The @payloadcms/richtext-lexical/react component doesn't work during static generation
const RichText = dynamic(
  () => import('@payloadcms/richtext-lexical/react').then((mod) => mod.RichText),
  { ssr: false }
)

interface PayloadRichTextProps {
  content: SerializedEditorState | null | undefined
  className?: string
}

export default function PayloadRichText({ content, className }: PayloadRichTextProps) {
  if (!content) return null

  return (
    <div className={className}>
      <RichText data={content} />
    </div>
  )
}
