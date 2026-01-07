import { getCategories } from '@/lib/products';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="p-12 text-center text-gray-600">
          No categories yet. Create your first category!
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-4">
                <FolderTree className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">{category.name}</p>
                  {category.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                  {category.parent && (
                    <p className="text-xs text-gray-500">Parent: {category.parent.name}</p>
                  )}
                  {category.children && category.children.length > 0 && (
                    <p className="text-xs text-gray-500">Subcategories: {category.children.length}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/${category.slug}`}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('Delete this category? This will not delete products in this category.')) {
                      await fetch(`/api/admin/categories/${category.slug}`, {
                        method: 'DELETE',
                      });
                      window.location.reload();
                    }
                  }}
                  className="p-2 hover:bg-red-50 text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
