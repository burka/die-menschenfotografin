import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'photographerName',
      type: 'text',
      required: true,
      defaultValue: 'Kathrin Krause',
      admin: {
        description: 'Name der Fotografin',
      },
    },
    {
      name: 'brandName',
      type: 'text',
      required: true,
      defaultValue: 'die Menschenfotografin',
      admin: {
        description: 'Markenname / Website-Titel',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Fine portraits for fine people',
      admin: {
        description: 'Slogan / Tagline',
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          defaultValue: 'info@die-menschenfotografin.de',
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+49 1556 6222336',
        },
        {
          name: 'address',
          type: 'textarea',
          defaultValue: 'Kathrin Krause\nFichtenweg 28\n22962 Siek',
        },
      ],
    },
    {
      name: 'impressum',
      type: 'richText',
      admin: {
        description: 'Impressum-Text (Rechtstext)',
      },
    },
    {
      name: 'datenschutz',
      type: 'richText',
      admin: {
        description: 'Datenschutzerklärung (Rechtstext)',
      },
    },
  ],
}
