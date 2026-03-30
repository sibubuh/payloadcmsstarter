import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`cover_image\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`background_image_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_image\` ADD \`image_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_slider_slides\` ADD \`image_url\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_columns_columns\` ADD \`background_color\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_columns_columns\` ADD \`text_color\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_columns_columns\` ADD \`padding\` text;`)
  await db.run(sql`ALTER TABLE \`pages_blocks_columns_columns\` ADD \`custom_class\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`__new_pages\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_pages\`("id", "title", "slug", "updated_at", "created_at") SELECT "id", "title", "slug", "updated_at", "created_at" FROM \`pages\`;`,
  )
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
}
