import type { ContentBlock } from '@/types/cms'
import type { GalleryImage } from '@/types/gallery'
import { GalleryBlock } from './GalleryBlock'
import { RichTextBlock } from './RichTextBlock'
import { ImageTextBlock } from './ImageTextBlock'
import { HeadingBlock } from './HeadingBlock'

export interface BlockRendererProps {
  blocks: ContentBlock[]
  onImageClick?: (image: GalleryImage, rect: DOMRect) => void
}

/**
 * Block registry: maps blockType to render function.
 * To add a new block type, add an entry here — no switch statement to modify (Open/Closed).
 */
const blockRenderers: Record<
  string,
  (block: ContentBlock, onImageClick?: BlockRendererProps['onImageClick']) => React.ReactNode
> = {
  galleryBlock: (block, onImageClick) => {
    if (block.blockType !== 'galleryBlock') return null
    return <GalleryBlock images={block.images} onImageClick={onImageClick} />
  },
  richTextBlock: (block) => {
    if (block.blockType !== 'richTextBlock') return null
    return <RichTextBlock content={block.content} />
  },
  imageTextBlock: (block) => {
    if (block.blockType !== 'imageTextBlock') return null
    return (
      <ImageTextBlock
        image={block.image}
        heading={block.heading}
        text={block.text}
        imagePosition={block.imagePosition}
      />
    )
  },
  headingBlock: (block) => {
    if (block.blockType !== 'headingBlock') return null
    return <HeadingBlock heading={block.heading} level={block.level} description={block.description} />
  },
}

/**
 * Dispatches CMS content blocks to their registered rendering components.
 * Uses a registry pattern — add new block types by extending blockRenderers.
 */
export function BlockRenderer({ blocks, onImageClick }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id || `block-${index}`
        const renderer = blockRenderers[block.blockType]

        if (!renderer) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Unknown block type: "${block.blockType}"`)
          }
          return null
        }

        return <div key={key}>{renderer(block, onImageClick)}</div>
      })}
    </>
  )
}
