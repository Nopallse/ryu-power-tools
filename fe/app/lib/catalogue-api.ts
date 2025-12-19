"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type Catalogue = {
  id: string;
  name?: string;
  title?: string;
  fileUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getCatalogues(token: string): Promise<Catalogue[]> {
  if (!token) {
    console.error('ERROR: No token provided to getCatalogues');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/catalogue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch catalogues");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getCatalogueById(id: string, token: string): Promise<Catalogue> {
  if (!token) {
    console.error('ERROR: No token provided to getCatalogueById');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/catalogue/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch catalogue");
  }

  const result = await response.json();
  return result.data || result;
}

export async function createCatalogue(
  formData: FormData,
  token: string
): Promise<Catalogue> {
  if (!token) {
    console.error('ERROR: No token provided to createCatalogue');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/catalogue`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to create catalogue");
  }

  const result = await response.json();
  return result.data || result;
}

export async function updateCatalogue(
  id: string,
  formData: FormData,
  token: string
): Promise<Catalogue> {
  if (!token) {
    console.error('ERROR: No token provided to updateCatalogue');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/catalogue/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to update catalogue");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteCatalogue(id: string, token: string): Promise<void> {
  if (!token) {
    console.error('ERROR: No token provided to deleteCatalogue');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/catalogue/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete catalogue");
  }
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
