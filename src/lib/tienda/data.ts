import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  SiteContent,
  StoreCategory,
  StoreProduct,
  StoreProductFilters,
  StoreProductsResult,
} from "@/lib/tienda/types";

const TABLES = {
  products: process.env.ECOM_PRODUCTS_TABLE ?? "products",
  categories: process.env.ECOM_CATEGORIES_TABLE ?? "categories",
  siteContent: process.env.ECOM_SITE_CONTENT_TABLE ?? "site_content",
  reviews: process.env.ECOM_REVIEWS_TABLE ?? "reviews",
};

const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Tecnologia premium para tu dia a dia",
  heroSubtitle: "Explora nuestra tienda con catalogo en tiempo real.",
  heroCtaLabel: "Ver tienda",
  heroCtaHref: "/tienda",
  footerHeadline: "22 Electronic",
  footerDescription: "Electronica, accesorios y audio con despacho nacional.",
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeProduct(raw: Record<string, unknown>): StoreProduct {
  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? raw.id ?? ""),
    name: String(raw.name ?? raw.title ?? "Producto"),
    description: raw.description ? String(raw.description) : null,
    imageUrl: raw.image_url
      ? String(raw.image_url)
      : raw.image
        ? String(raw.image)
        : null,
    price: toNumber(raw.price),
    compareAtPrice: raw.compare_at_price != null ? toNumber(raw.compare_at_price) : null,
    categoryId: raw.category_id ? String(raw.category_id) : null,
    categorySlug: raw.category_slug ? String(raw.category_slug) : null,
    categoryName: raw.category_name ? String(raw.category_name) : null,
    stock: toNumber(raw.stock, 0),
    rating: toNumber(raw.rating, 0),
    reviewCount: toNumber(raw.review_count, 0),
    status: String(raw.status ?? "active"),
  };
}

function normalizeCategory(raw: Record<string, unknown>): StoreCategory {
  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? raw.id ?? ""),
    name: String(raw.name ?? "Categoria"),
    description: raw.description ? String(raw.description) : null,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.siteContent)
    .select("key, value, content")
    .in("key", [
      "hero_title",
      "hero_subtitle",
      "hero_cta_label",
      "hero_cta_href",
      "footer_headline",
      "footer_description",
    ]);

  if (error || !data) {
    return DEFAULT_SITE_CONTENT;
  }

  const byKey = new Map<string, string>();
  for (const row of data as Array<Record<string, unknown>>) {
    const key = String(row.key ?? "");
    const value = row.value ?? row.content;
    if (!key || value == null) continue;
    byKey.set(key, String(value));
  }

  return {
    heroTitle: byKey.get("hero_title") ?? DEFAULT_SITE_CONTENT.heroTitle,
    heroSubtitle: byKey.get("hero_subtitle") ?? DEFAULT_SITE_CONTENT.heroSubtitle,
    heroCtaLabel: byKey.get("hero_cta_label") ?? DEFAULT_SITE_CONTENT.heroCtaLabel,
    heroCtaHref: byKey.get("hero_cta_href") ?? DEFAULT_SITE_CONTENT.heroCtaHref,
    footerHeadline: byKey.get("footer_headline") ?? DEFAULT_SITE_CONTENT.footerHeadline,
    footerDescription: byKey.get("footer_description") ?? DEFAULT_SITE_CONTENT.footerDescription,
  };
}

export async function getCategories(): Promise<StoreCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(TABLES.categories)
    .select("id, slug, name, description")
    .order("name", { ascending: true });

  if (error || !data) return [];
  return (data as Array<Record<string, unknown>>).map(normalizeCategory);
}

function applySort(
  query: ReturnType<Awaited<ReturnType<typeof createClient>>["from"]>,
  sort: StoreProductFilters["sort"]
) {
  if (sort === "precio_asc") return query.order("price", { ascending: true });
  if (sort === "precio_desc") return query.order("price", { ascending: false });
  return query.order("created_at", { ascending: false });
}

export async function getProducts(filters: StoreProductFilters = {}): Promise<StoreProductsResult> {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 12, 1), 48);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase
    .from(TABLES.products)
    .select(
      "id, slug, name, title, description, image_url, image, price, compare_at_price, category_id, category_slug, category_name, stock, rating, review_count, status",
      { count: "exact" }
    )
    .eq("status", "active")
    .range(from, to);

  if (filters.category) {
    query = query.or(`category_slug.eq.${filters.category},category_id.eq.${filters.category}`);
  }

  if (filters.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.q) {
    const term = filters.q.trim();
    if (term) {
      query = query.or(`name.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%`);
    }
  }

  query = applySort(query, filters.sort);

  const { data, error, count } = await query;

  if (error || !data) {
    return { items: [], page, pageSize, total: 0, totalPages: 0 };
  }

  const items = (data as Array<Record<string, unknown>>).map(normalizeProduct);
  const total = count ?? items.length;

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.products)
    .select(
      "id, slug, name, title, description, image_url, image, price, compare_at_price, category_id, category_slug, category_name, stock, rating, review_count, status"
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) return null;
  return normalizeProduct(data as Record<string, unknown>);
}

export async function getProductsByIds(productIds: string[]): Promise<StoreProduct[]> {
  if (productIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLES.products)
    .select(
      "id, slug, name, title, description, image_url, image, price, compare_at_price, category_id, category_slug, category_name, stock, rating, review_count, status"
    )
    .in("id", productIds);

  if (error || !data) return [];
  return (data as Array<Record<string, unknown>>).map(normalizeProduct);
}

export async function getRelatedProducts(categorySlug: string | null, excludedId: string): Promise<StoreProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from(TABLES.products)
    .select(
      "id, slug, name, title, description, image_url, image, price, compare_at_price, category_id, category_slug, category_name, stock, rating, review_count, status"
    )
    .eq("status", "active")
    .neq("id", excludedId)
    .limit(4);

  if (categorySlug) {
    query = query.eq("category_slug", categorySlug);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as Array<Record<string, unknown>>).map(normalizeProduct);
}
