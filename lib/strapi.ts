const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function fetchAPI<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${path}`;
  
  // Add query parameters if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...fetchOptions,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
  }

  return response.json();
}

export async function getBlogPosts(
  page = 1,
  pageSize = 10
): Promise<StrapiResponse<BlogPost[]>> {
  const data = await fetchAPI<StrapiResponse<BlogPost[]>>('/blog-posts', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      'sort[0]': 'publishedDate:desc',
      'populate': '*',
    },
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  // Ensure data integrity and uniqueness
  if (data && data.data) {
    data.data = data.data.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    );
  }

  return data;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const data = await fetchAPI<StrapiResponse<BlogPost[]>>('/blog-posts', {
    params: {
      'filters[Slug][$eq]': slug,
      'populate': '*',
    },
    next: { revalidate: 60 },
  });

  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data[0];
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const data = await fetchAPI<StrapiResponse<BlogPost[]>>('/blog-posts', {
    params: {
      'pagination[pageSize]': 100,
    },
  });

  // Ensure unique posts and filter out empty slugs
  const uniquePosts = data.data ? data.data.filter((post, index, self) => 
    index === self.findIndex(p => p.id === post.id)
  ) : [];

  return uniquePosts
    .map((post) => post.Slug || post.slug || '')
    .filter((slug) => slug !== '');
}

export { STRAPI_URL };

