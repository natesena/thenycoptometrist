'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

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
