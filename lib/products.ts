import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId?: string;
  referralUrl: string;
  price?: number;
  stock?: number;
  featured: boolean;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
  category?: ProductCategory;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  filename?: string;
  mimeType?: string;
  createdAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentId?: string;
  sort?: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: ProductCategory;
  children?: ProductCategory[];
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  categoryId?: string;
  price?: number;
  referralUrl: string;
  stock?: number;
  featured?: boolean;
  available?: boolean;
  images?: { url: string; alt?: string; width?: number; height?: number }[];
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  referralUrl?: string;
  stock?: number;
  featured?: boolean;
  available?: boolean;
  images?: { url: string; alt?: string; width?: number; height?: number }[];
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentId?: string;
  sort?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  parentId?: string;
  sort?: number;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getProducts(filters?: {
  categoryId?: string;
  available?: boolean;
  featured?: boolean;
}): Promise<Product[]> {
  const where: any = {};
  
  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (typeof filters?.available === 'boolean') where.available = filters.available;
  if (typeof filters?.featured === 'boolean') where.featured = filters.featured;
  
  return await prisma.product.findMany({
    where,
    include: { images: true, category: true },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });
}

export async function getProductById(id: string): Promise<Product | null> {
  return await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    select: { slug: true },
    where: { available: true },
  });
  
  return products.map((p) => p.slug);
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  const { images, ...productData } = data;
  
  const slug = productData.slug || generateSlug(productData.name);
  
  return await prisma.product.create({
    data: {
      ...productData,
      slug,
      images: images ? { create: images } : undefined,
    },
    include: { images: true, category: true },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<Product> {
  const { images, ...productData } = data;
  
  const slug = productData.slug || (productData.name ? generateSlug(productData.name) : undefined);
  
  return await prisma.product.update({
    where: { id },
    data: {
      ...productData,
      ...(slug && { slug }),
      images: images
        ? {
            deleteMany: {},
            create: images,
          }
        : undefined,
    },
    include: { images: true, category: true },
  });
}

export async function deleteProduct(id: string): Promise<Product> {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function getCategories(filters?: {
  parentId?: string;
}): Promise<ProductCategory[]> {
  const where: any = {};
  
  if (filters?.parentId) where.parentId = filters.parentId;
  
  return await prisma.productCategory.findMany({
    where,
    include: { parent: true, children: true },
    orderBy: { sort: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  return await prisma.productCategory.findUnique({
    where: { slug },
    include: { parent: true, children: true },
  });
}

export async function createCategory(data: CreateCategoryInput): Promise<ProductCategory> {
  const slug = data.slug || generateSlug(data.name);
  
  return await prisma.productCategory.create({
    data: {
      ...data,
      slug,
    },
    include: { parent: true, children: true },
  });
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryInput
): Promise<ProductCategory> {
  const slug = data.slug || (data.name ? generateSlug(data.name) : undefined);
  
  return await prisma.productCategory.update({
    where: { id },
    data: {
      ...data,
      ...(slug && { slug }),
    },
    include: { parent: true, children: true },
  });
}

export async function deleteCategory(id: string): Promise<ProductCategory> {
  return await prisma.productCategory.delete({
    where: { id },
  });
}

export async function deleteImage(id: string): Promise<Image> {
  return await prisma.image.delete({
    where: { id },
  });
}
