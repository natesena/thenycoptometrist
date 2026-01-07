'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import type { ProductCategory } from '@/lib/products';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
    sort: 0,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    async function loadCategories() {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data: ProductCategory[] = await response.json();
        setCategories(data);
      }
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/admin/categories');
      } else {
        alert('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({
      ...formData,
      name,
      slug,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-[400]">Back to Categories</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Create New Category
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly identifier. Auto-generated from name if empty.
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Parent Category
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">None (Root Category)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              For nested categories. Select "None" for root-level categories.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.sort}
              onChange={(e) => setFormData({ ...formData, sort: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers display first. Default is 0.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
            Description
          </h2>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Category Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 pb-2 border-b">
            SEO (Optional)
          </h2>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="Defaults to category name if empty"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max 60 characters. Defaults to category name.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              rows={3}
              maxLength={160}
              placeholder="Defaults to category description if empty"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max 160 characters. Defaults to category description.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
