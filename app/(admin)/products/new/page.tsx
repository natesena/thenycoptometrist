import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function CreateProductPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-[400]">Back to Products</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Create New Product
      </h1>
      
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Product form loading...</p>
        <p className="text-sm text-gray-500 mt-2">
          This page will be implemented as a client component with:
        </p>
        <ul className="text-left text-sm text-gray-600 mt-4 space-y-1">
          <li>• All fields: name, slug (auto-generated), description, category (dropdown), price, referral URL, stock, featured toggle, available toggle</li>
          <li>• Image management: add image via URL + alt, list images, delete images</li>
          <li>• Category dropdown populated from /api/admin/categories</li>
          <li>• Form validation (required fields)</li>
          <li>• Save and Cancel buttons</li>
          <li>• Auto-generate slug from product name</li>
          <li>• Loading state during save</li>
          <li>• Redirect to /admin/products on success</li>
        </ul>
      </div>
    </div>
  );
}
