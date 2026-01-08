"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryNode = Category & {
  children?: CategoryNode[];
};

export type TreeSelectNode = {
  value: string;
  label: string;
  children?: TreeSelectNode[];
};

export async function getCategories(token: string): Promise<Category[]> {
  if (!token) {
    console.error('ERROR: No token provided to getCategories');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getCategoryTree(token: string): Promise<TreeSelectNode[]> {
  if (!token) {
    console.error('ERROR: No token provided to getCategoryTree');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category/tree`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category tree");
  }

  const result = await response.json();
  const data = result.data || result;
  
  // Transform CategoryNode to TreeSelectNode format
  const transformToTreeSelect = (nodes: any[]): TreeSelectNode[] => {
    if (!Array.isArray(nodes)) return [];
    
    return nodes
      .filter(node => node && node.id && node.name) // Filter out invalid nodes
      .map(node => {
        const treeNode: TreeSelectNode = {
          value: node.id,
          label: node.name,
        };
        
        // Only add children if they exist and are not empty
        if (Array.isArray(node.children) && node.children.length > 0) {
          const transformedChildren = transformToTreeSelect(node.children);
          if (transformedChildren.length > 0) {
            treeNode.children = transformedChildren;
          }
        }
        
        return treeNode;
      });
  };

  return Array.isArray(data) ? transformToTreeSelect(data) : [];
}

export async function getCategoryById(id: string, token: string): Promise<Category> {
  if (!token) {
    console.error('ERROR: No token provided to getCategoryById');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const result = await response.json();
  return result.data || result;
}

export async function createCategory(
  formData: FormData,
  token: string
): Promise<Category> {
  if (!token) {
    console.error('ERROR: No token provided to createCategory');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to create category");
  }

  const result = await response.json();
  return result.data || result;
}

export async function updateCategory(
  id: string,
  formData: FormData,
  token: string
): Promise<Category> {
  if (!token) {
    console.error('ERROR: No token provided to updateCategory');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to update category");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  if (!token) {
    console.error('ERROR: No token provided to deleteCategory');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/category/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete category");
  }
}

// Public (no-auth) helpers for site pages
export async function getPublicCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/category`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getPublicCategoryTree(): Promise<CategoryNode[]> {
  const response = await fetch(`${API_BASE}/category/tree`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch category tree");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getPublicCategoryById(id: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/category/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getPublicCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/category/by/${slug}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const result = await response.json();
  return result.data || result;
}

export type CategoryWithChildren = {
  category: Category;
  children: (Category & { productCount: number })[];
};

export async function getPublicCategoryChildrenBySlug(slug: string): Promise<CategoryWithChildren> {
  console.log('🔍 Fetching children for slug:', slug);
  const url = `${API_BASE}/category/by/${slug}/children`;
  console.log('🔗 URL:', url);
  
  const response = await fetch(url, {
    cache: 'no-store', // Prevent caching
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  console.log('📡 Response status:', response.status);
  
  if (!response.ok) {
    console.error('❌ Response not OK:', response.status, response.statusText);
    throw new Error("Failed to fetch category children");
  }

  const result = await response.json();
  console.log('📦 Raw result:', result);
  console.log('📦 Result.data:', result.data);
  const finalData = result.data || result;
  console.log('✅ Final data to return:', finalData);
  return finalData;
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
