import type { ContentBlock } from '@/types/cms'
import type { GalleryImage } from '@/types/gallery'
import { GalleryBlock } from './GalleryBlock'
import { RichTextBlock } from './RichTextBlock'

export interface BlockRendererProps {
  blocks: ContentBlock[]
  onImageClick?: (image: GalleryImage, rect: DOMRect) => void
}

/**
 * Dispatches CMS content blocks to their appropriate rendering components
 * Handles unknown block types gracefully by logging warnings
 */
export function BlockRenderer({ blocks, onImageClick }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `block-${index}`

        switch (block.blockType) {
          case 'galleryBlock':
            return <GalleryBlock key={key} images={block.images} onImageClick={onImageClick} />

          case 'richTextBlock':
            return <RichTextBlock key={key} content={block.content} />

          default:
            console.warn(`Unknown block type encountered:`, block)
            return null
        }
      })}
    </>
  )
}
