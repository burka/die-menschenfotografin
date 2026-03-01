import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "kindergarten")',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value.toLowerCase().replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Reihenfolge auf der Startseite (niedrigere Zahl = weiter vorne)',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image for the category card',
      },
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Vorschaubild für die Homepage-Kachel',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description of the category',
      },
    },
    {
      name: 'content',
      type: 'blocks',
      blocks: [
        {
          slug: 'galleryBlock',
          fields: [
            {
              name: 'images',
              type: 'relationship',
              relationTo: 'images',
              hasMany: true,
              admin: {
                description: 'Select images to display in this gallery section',
              },
            },
          ],
        },
        {
          slug: 'richTextBlock',
          fields: [
            {
              name: 'content',
              type: 'richText',
            },
          ],
        },
        {
          slug: 'imageTextBlock',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                description: 'Optionale Überschrift',
              },
            },
            {
              name: 'text',
              type: 'richText',
              required: true,
            },
            {
              name: 'imagePosition',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Bild links', value: 'left' },
                { label: 'Bild rechts', value: 'right' },
              ],
              admin: {
                description: 'Position des Bildes',
              },
            },
          ],
        },
        {
          slug: 'headingBlock',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'level',
              type: 'select',
              defaultValue: 'h2',
              options: [
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
              ],
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Optionaler Beschreibungstext unter der Überschrift',
              },
            },
          ],
        },
      ],
    },
  ],
}
