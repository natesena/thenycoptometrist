import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

  // For local development, store files locally
  // For production, configure S3 or GCS storage adapter
})
