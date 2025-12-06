'use client'

import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: string
  href: string
  isCurrent?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  onHomeClick?: () => void
}

export function Breadcrumbs({ items, className, onHomeClick }: BreadcrumbsProps) {
  return (
    <nav className={`${styles.breadcrumbs} ${className || ''}`} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.href} className={styles.item}>
            {item.isCurrent ? (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            ) : (
              <>
                {item.href === '/' && onHomeClick ? (
                  <button
                    type="button"
                    onClick={onHomeClick}
                    className={styles.link}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                )}
                {index < items.length - 1 && (
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
