import { getCategories, createCategory } from '@/lib/products';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get('parentId') || undefined;
  
  const categories = await getCategories({ parentId });
  
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const category = await createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
