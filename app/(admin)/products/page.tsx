import { getProducts } from '@/lib/products';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default async function AdminProductsPage() {
  const products = await getProducts();
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            No products yet. Create your first product!
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Featured</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.price ? `$${product.price.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.stock ?? '-'}
                  </td>
                  <td className="px-4 py-3">
                    {product.featured ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.available ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this product?')) {
                            await fetch(`/api/admin/products/${product.id}`, {
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
