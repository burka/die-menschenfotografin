import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Create site_settings table for the SiteSettings global
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`photographer_name\` text NOT NULL,
  	\`brand_name\` text NOT NULL,
  	\`tagline\` text,
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`contact_address\` text,
  	\`impressum\` text,
  	\`datenschutz\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`site_settings\`;`)
}
