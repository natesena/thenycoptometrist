import Link from 'next/link';
import { LayoutDashboardMain } from '@payloadcms/ui';
import { requireAdminAuth } from '@/lib/admin-auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold text-gray-900">
            Dashboard
          </Link>
        </div>
        <nav className="px-4 py-2">
          <Link href="/admin/products" className="block px-4 py-3 rounded-lg hover:bg-gray-100 mb-2">
            Products
          </Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded-lg hover:bg-gray-100 mb-2">
            Categories
          </Link>
          <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-gray-100">
            Content
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <LayoutDashboardMain>
          {children}
        </LayoutDashboardMain>
      </main>
    </div>
  );
}
