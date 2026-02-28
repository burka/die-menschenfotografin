import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'
import styles from './ImageTextBlock.module.css'

export interface ImageTextBlockProps {
  image: {
    url: string
    alt: string
    width: number
    height: number
  }
  heading?: string
  text: SerializedEditorState
  imagePosition: 'left' | 'right'
}

export function ImageTextBlock({ image, heading, text, imagePosition }: ImageTextBlockProps) {
  return (
    <div className={`${styles.container} ${imagePosition === 'right' ? styles.reversed : ''}`}>
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.textWrapper}>
        {heading && <h3 className={styles.heading}>{heading}</h3>}
        <div className={styles.text}>
          <RichText data={text} />
        </div>
      </div>
    </div>
  )
}
