"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type ProductImage = {
  url: string;
  imageUrl?: string;
};

const normalizeImage = (img: Partial<ProductImage> & Record<string, any>) => {
  const raw = img?.url ?? img?.imageUrl;
  const normalizedUrl = raw
    ? raw.startsWith('http')
      ? raw
      : `${API_BASE}${raw}`
    : '/images/product.jpg';
  return { ...img, url: normalizedUrl } as ProductImage;
};

export type ProductCategory = {
  categoryId: string;
  category: {
    name: string;
  };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  storeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  productCategory: ProductCategory[];
  productImages: ProductImage[];
};

export async function getProducts(token: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();
  const products = result.data || result;
  
  return products.map((product: Product) => ({
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  }));
}

export async function getProductById(id: string, token: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  const product = result.data || result;
  
  return {
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  };
}

export async function createProduct(
  formData: FormData,
  token: string
): Promise<Product> {
  const response = await fetch(`${API_BASE}/product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to create product");
  }

  const result = await response.json();
  return result.data || result;
}

export async function updateProduct(
  id: string,
  formData: FormData,
  token: string
): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to update product");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete product");
  }
}

export async function deleteProductImage(
  productId: string,
  imageUrl: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/product/${productId}/image`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete image");
  }
}

// Public (no-auth) helpers for site pages
export async function getPublicLatestProducts(limit?: number): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/latest`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch latest products");
  }

  const result = await response.json();
  let products = result.data || result;
  
  if (limit) {
    products = products.slice(0, limit);
  }
  
  return products.map((product: Product) => ({
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  }));
}

export async function getPublicProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  const product = result.data || result;
  
  return {
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  };
}

export async function getPublicProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/slug/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  const product = result.data || result;
  
  return {
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  };
}

export async function getPublicProductsByCategorySlug(slug: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/category-slug/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }

  const result = await response.json();
  const products = result.data || result;
  
  return products.map((product: Product) => ({
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  }));
}

export async function searchPublicProducts(query: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/search/${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const result = await response.json();
  const products = result.data || result;
  
  return products.map((product: Product) => ({
    ...product,
    productImages: (product.productImages || []).map(normalizeImage),
  }));
}

async function safeErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message.join(", ");
  } catch {
    /* ignore */
  }
  return response.statusText || null;
}