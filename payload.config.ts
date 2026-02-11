import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { authjsPlugin } from 'payload-authjs'
import path from 'path'
import { fileURLToPath } from 'url'

import { authConfig } from './auth.config'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { BlogPosts } from './collections/BlogPosts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- NYC Optometrist CMS',
    },
  },

  collections: [Users, Media, BlogPosts],

  editor: lexicalEditor(),

  plugins: [
    authjsPlugin({
      authjsConfig: authConfig,
    }),
    // GCS storage adapter — only enabled when GCS_BUCKET_NAME is set.
    // In local dev (no GCS env vars), Payload uses local filesystem (public/media/).
    // See plan: .claude/plans/humble-mixing-elephant.md
    ...(process.env.GCS_BUCKET_NAME
      ? [
          gcsStorage({
            collections: { media: true },
            bucket: process.env.GCS_BUCKET_NAME,
            options: {
              projectId: process.env.GCS_PROJECT_ID,
              credentials: process.env.GCS_CREDENTIALS
                ? JSON.parse(process.env.GCS_CREDENTIALS)
                : undefined,
            },
          }),
        ]
      : []),
  ],

  db: postgresAdapter({
    pool: {
      connectionString: process.env.PAYLOAD_DATABASE_URL || '',
    },
  }),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

})
