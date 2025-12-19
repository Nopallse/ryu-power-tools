"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  contentHtml: string;
  primaryImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  metaTags?: any;
  author?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ImageArticle = {
  id: string;
  imageUrl: string;
  createdAt: string;
};

export async function getArticles(token: string): Promise<Article[]> {
  if (!token) {
    console.error('ERROR: No token provided to getArticles');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getArticleById(id: string, token: string): Promise<Article> {
  if (!token) {
    console.error('ERROR: No token provided to getArticleById');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getArticleBySlug(slug: string, token: string): Promise<Article> {
  if (!token) {
    console.error('ERROR: No token provided to getArticleBySlug');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/slug/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  const result = await response.json();
  return result.data || result;
}

export async function createArticle(
  formData: FormData,
  token: string
): Promise<Article> {
  if (!token) {
    console.error('ERROR: No token provided to createArticle');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to create article");
  }

  const result = await response.json();
  return result.data || result;
}

export async function updateArticle(
  id: string,
  formData: FormData,
  token: string
): Promise<Article> {
  if (!token) {
    console.error('ERROR: No token provided to updateArticle');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to update article");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteArticle(id: string, token: string): Promise<void> {
  if (!token) {
    console.error('ERROR: No token provided to deleteArticle');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete article");
  }
}

export async function uploadImage(
  file: File,
  token: string
): Promise<ImageArticle> {
  if (!token) {
    console.error('ERROR: No token provided to uploadImage');
    throw new Error("Authentication token is missing");
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/article/upload-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to upload image");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getImageArticles(token: string): Promise<ImageArticle[]> {
  if (!token) {
    console.error('ERROR: No token provided to getImageArticles');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/image-article`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteImageArticle(id: string, token: string): Promise<void> {
  if (!token) {
    console.error('ERROR: No token provided to deleteImageArticle');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/article/image-article/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete image");
  }
}

// Public (no-auth) helpers for site pages
export async function getPublicArticles(): Promise<Article[]> {
  const response = await fetch(`${API_BASE}/article`);
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const result = await response.json();
  const data: Article[] = (result.data || result) ?? [];
  return Array.isArray(data) ? data.filter(a => a.status === 'PUBLISHED') : [];
}

export async function getPublicArticleById(id: string): Promise<Article> {
  const response = await fetch(`${API_BASE}/article/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }
  const result = await response.json();
  return result.data || result;
}

export async function getPublicArticleBySlug(slug: string): Promise<Article> {
  const response = await fetch(`${API_BASE}/article/slug/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }
  const result = await response.json();
  return result.data || result;
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
