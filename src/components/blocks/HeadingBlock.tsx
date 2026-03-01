import styles from './HeadingBlock.module.css'

export interface HeadingBlockProps {
  heading: string
  level: 'h2' | 'h3' | 'h4'
  description?: string
}

export function HeadingBlock({ heading, level, description }: HeadingBlockProps) {
  const Tag = level

  return (
    <div className={styles.container}>
      <Tag className={styles.heading} data-level={level}>
        {heading}
      </Tag>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
