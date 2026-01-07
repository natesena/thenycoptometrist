import { getProducts, createProduct } from '@/lib/products';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId') || undefined;
  const available = searchParams.get('available') === 'true' ? true
                   : searchParams.get('available') === 'false' ? false
                   : undefined;
  const featured = searchParams.get('featured') === 'true' ? true
                   : undefined;
  
  const products = await getProducts({ categoryId, available, featured });
  
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
