declare global {
  interface Service {
    id: string;
    title: string;
    icon: JSX.Element;
    description: string;
    color: string;
  }

  interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    service: string;
    review: string;
    initials: string;
    location: string;
  }

  interface CategoryType {
    icon: React.ComponentType<{
      className?: string;
    }>;
    title: string;
    optometrist: {
      title: string;
      points: string[];
    };
    ophthalmologist: {
      title: string;
      points: string[];
    };
  }

  interface BlogPost {
    id: number;
    documentId: string;
    title: string;
    slug?: string;
    Slug?: string; // Strapi field name (capitalized)
    content: string;
    excerpt?: string;
    Excerpt?: string; // Strapi field name (capitalized)
    featuredImage?: {
      id: number;
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    }[];
    publishedDate: string;
    author: string;
    metaDescription?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }

  interface StrapiResponse<T> {
    data: T;
    meta: {
      pagination?: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
}

export {};
