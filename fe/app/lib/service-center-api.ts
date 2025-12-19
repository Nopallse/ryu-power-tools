"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type ServiceCenter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getServiceCenters(token: string): Promise<ServiceCenter[]> {
  if (!token) {
    console.error('ERROR: No token provided to getServiceCenters');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/service-center`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch service centers");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getServiceCenterById(id: string, token: string): Promise<ServiceCenter> {
  if (!token) {
    console.error('ERROR: No token provided to getServiceCenterById');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/service-center/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch service center");
  }

  const result = await response.json();
  return result.data || result;
}

export async function createServiceCenter(
  data: Omit<ServiceCenter, 'id' | 'createdAt' | 'updatedAt'>,
  token: string
): Promise<ServiceCenter> {
  if (!token) {
    console.error('ERROR: No token provided to createServiceCenter');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/service-center`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to create service center");
  }

  const result = await response.json();
  return result.data || result;
}

export async function updateServiceCenter(
  id: string,
  data: Partial<Omit<ServiceCenter, 'id' | 'createdAt' | 'updatedAt'>>,
  token: string
): Promise<ServiceCenter> {
  if (!token) {
    console.error('ERROR: No token provided to updateServiceCenter');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/service-center/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to update service center");
  }

  const result = await response.json();
  return result.data || result;
}

export async function deleteServiceCenter(id: string, token: string): Promise<void> {
  if (!token) {
    console.error('ERROR: No token provided to deleteServiceCenter');
    throw new Error("Authentication token is missing");
  }

  const response = await fetch(`${API_BASE}/service-center/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message ?? "Failed to delete service center");
  }
}

// Public (no-auth) helpers for site pages
export async function getPublicServiceCenters(): Promise<ServiceCenter[]> {
  const response = await fetch(`${API_BASE}/service-center`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch service centers");
  }

  const result = await response.json();
  return result.data || result;
}

export async function getPublicServiceCenterById(id: string): Promise<ServiceCenter> {
  const response = await fetch(`${API_BASE}/service-center/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch service center");
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
