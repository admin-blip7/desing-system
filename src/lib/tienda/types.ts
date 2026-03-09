export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  categoryId: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  status: string;
};

export type StoreCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type SiteContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  footerHeadline: string;
  footerDescription: string;
};

export type StoreProductFilters = {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: "recientes" | "precio_asc" | "precio_desc";
};

export type StoreProductsResult = {
  items: StoreProduct[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type StoreCart = {
  items: CartLine[];
};

export type StoreCartItem = {
  product: StoreProduct;
  quantity: number;
  lineTotal: number;
};

export type HydratedStoreCart = {
  items: StoreCartItem[];
  subtotal: number;
  totalItems: number;
};
