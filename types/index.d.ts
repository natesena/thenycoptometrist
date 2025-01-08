declare global {
  interface Service {
    id: string;
    title: string;
    icon: JSX.Element;
    description: string;
    color: string;
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
}

export {};
