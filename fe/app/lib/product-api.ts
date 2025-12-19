"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type ProductImage = {
  url: string;
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
  
  // Convert relative image URLs to absolute URLs
  return products.map((product: Product) => ({
    ...product,
    productImages: product.productImages.map((img) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })),
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
  
  // Convert relative image URLs to absolute URLs
  return {
    ...product,
    productImages: product.productImages.map((img: ProductImage) => ({
      ...img,
      url: img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`,
    })),
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

// Public (no-auth) helpers for site pages
export async function getPublicLatestProducts(limit?: number): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/latest`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch latest products");
  }

  const result = await response.json();
  let products = result.data || result;
  
  // Apply limit if provided
  if (limit) {
    products = products.slice(0, limit);
  }
  
  // Convert relative image URLs to absolute URLs
  return products.map((product: Product) => ({
    ...product,
    productImages: product.productImages?.map((img: ProductImage) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })) || [],
  }));
}

export async function getPublicProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  const product = result.data || result;
  
  // Convert relative image URLs to absolute URLs
  return {
    ...product,
    productImages: product.productImages?.map((img: ProductImage) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })) || [],
  };
}

export async function getPublicProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/product/slug/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const result = await response.json();
  const product = result.data || result;
  
  // Convert relative image URLs to absolute URLs
  return {
    ...product,
    productImages: product.productImages?.map((img: ProductImage) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })) || [],
  };
}

export async function getPublicProductsByCategorySlug(slug: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/category/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }

  const result = await response.json();
  const products = result.data || result;
  
  // Convert relative image URLs to absolute URLs
  return products.map((product: Product) => ({
    ...product,
    productImages: product.productImages?.map((img: ProductImage) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })) || [],
  }));
}

export async function searchPublicProducts(query: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/product/search/${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const result = await response.json();
  const products = result.data || result;
  
  // Convert relative image URLs to absolute URLs
  return products.map((product: Product) => ({
    ...product,
    productImages: product.productImages?.map((img: ProductImage) => ({
      ...img,
      url: img.url ? (img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`) : '/images/product.jpg',
    })) || [],
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
