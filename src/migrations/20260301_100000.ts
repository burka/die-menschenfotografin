import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Add sort_order column to categories
  await db.run(sql`ALTER TABLE \`categories\` ADD \`sort_order\` numeric DEFAULT 0 NOT NULL;`)
  await db.run(sql`CREATE INDEX \`categories_sort_order_idx\` ON \`categories\` (\`sort_order\`);`)

  // Add preview_image_id column to categories
  await db.run(sql`ALTER TABLE \`categories\` ADD \`preview_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`categories_preview_image_idx\` ON \`categories\` (\`preview_image_id\`);`)

  // Create categories_blocks_image_text_block table
  await db.run(sql`CREATE TABLE \`categories_blocks_image_text_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`heading\` text,
  	\`text\` text,
  	\`image_position\` text DEFAULT 'left',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`categories_blocks_image_text_block_order_idx\` ON \`categories_blocks_image_text_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`categories_blocks_image_text_block_parent_id_idx\` ON \`categories_blocks_image_text_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_blocks_image_text_block_path_idx\` ON \`categories_blocks_image_text_block\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`categories_blocks_image_text_block_image_idx\` ON \`categories_blocks_image_text_block\` (\`image_id\`);`)

  // Create categories_blocks_heading_block table
  await db.run(sql`CREATE TABLE \`categories_blocks_heading_block\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`level\` text DEFAULT 'h2',
  	\`description\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`categories_blocks_heading_block_order_idx\` ON \`categories_blocks_heading_block\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`categories_blocks_heading_block_parent_id_idx\` ON \`categories_blocks_heading_block\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_blocks_heading_block_path_idx\` ON \`categories_blocks_heading_block\` (\`_path\`);`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE IF EXISTS \`categories_blocks_image_text_block\`;`)
  await db.run(sql`DROP TABLE IF EXISTS \`categories_blocks_heading_block\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`categories_sort_order_idx\`;`)
  await db.run(sql`DROP INDEX IF EXISTS \`categories_preview_image_idx\`;`)

  // SQLite doesn't support DROP COLUMN directly, so we recreate the table
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`hero_image_id\` integer,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_categories\`("id", "title", "slug", "hero_image_id", "description", "updated_at", "created_at") SELECT "id", "title", "slug", "hero_image_id", "description", "updated_at", "created_at" FROM \`categories\`;`)
  await db.run(sql`DROP TABLE \`categories\`;`)
  await db.run(sql`ALTER TABLE \`__new_categories\` RENAME TO \`categories\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`categories_slug_idx\` ON \`categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`categories_hero_image_idx\` ON \`categories\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`categories_updated_at_idx\` ON \`categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`categories_created_at_idx\` ON \`categories\` (\`created_at\`);`)
}
