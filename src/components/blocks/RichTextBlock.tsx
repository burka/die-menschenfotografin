import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'
import styles from './RichTextBlock.module.css'

export interface RichTextBlockProps {
  content: SerializedEditorState
}

/**
 * Renders rich text content from Payload CMS using Lexical editor format
 */
export function RichTextBlock({ content }: RichTextBlockProps) {
  if (!content) {
    return null
  }

  return (
    <div className={styles.richTextBlock}>
      <RichText data={content} />
    </div>
  )
}
