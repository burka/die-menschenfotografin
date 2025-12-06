import type { GalleryImage } from '@/types/gallery'
import styles from './GalleryBlock.module.css'

export interface GalleryBlockProps {
  images: {
    image: {
      url: string
      alt: string
      width: number
      height: number
    }
    caption?: string
  }[]
  onImageClick?: (image: GalleryImage, rect: DOMRect) => void
}

/**
 * Renders a grid of images from CMS gallery block
 */
export function GalleryBlock({ images, onImageClick }: GalleryBlockProps) {
  if (!images || images.length === 0) {
    return null
  }

  const handleImageClick = (
    imageData: GalleryBlockProps['images'][0],
    event: React.MouseEvent<HTMLLIElement>,
  ) => {
    if (!onImageClick) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const galleryImage: GalleryImage = {
      id: imageData.image.url,
      src: imageData.image.url,
      alt: imageData.image.alt,
      caption: imageData.caption,
    }

    onImageClick(galleryImage, rect)
  }

  return (
    <div className={styles.galleryBlock}>
      <ul className={styles.grid}>
        {images.map((item, index) => (
          <li
            key={item.image.url || index}
            className={styles.imageItem}
            onClick={(e) => handleImageClick(item, e)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image.url}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              className={styles.image}
              loading="lazy"
            />
            {item.caption && <div className={styles.caption}>{item.caption}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
