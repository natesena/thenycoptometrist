import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { gcsAdapter } from '@payloadcms/storage-gcs'
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

  // Configure GCS storage adapter
  upload: {
    disableLocalStorage: true,
  },

  storage: {
    ...gcsAdapter({
      bucket: process.env.GCS_BUCKET_NAME || '',
      credentials: {
        type: 'service_account',
        project_id: process.env.GCP_PROJECT_ID || '',
        private_key_id: process.env.GCS_PRIVATE_KEY_ID || '',
        private_key: (process.env.GCS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        client_email: process.env.GCS_CLIENT_EMAIL || '',
        client_id: process.env.GCS_CLIENT_ID || '',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GCS_CLIENT_X509_CERT_URL || '',
      },
      options: {
        prefix: 'media',
      },
    }),
  },
})
