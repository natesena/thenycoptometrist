import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // Only logged-in users can read user data
    read: ({ req: { user } }) => Boolean(user),
    // Only logged-in admins can create new users
    create: ({ req: { user } }) => Boolean(user),
    // Users can update themselves, admins can update anyone
    update: ({ req: { user } }) => Boolean(user),
    // Only admins can delete users
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}
