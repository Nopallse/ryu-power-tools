"use client";

import { clearStoredAuth } from "./auth-client";

/**
 * Handle unauthorized error response (401) - typically due to expired token
 * Redirects user to login page and clears stored auth
 */
export function handleUnauthorized(router: any): void {
  console.warn("⚠️ Unauthorized: Token expired or invalid");
  clearStoredAuth();
  router.push("/login");
}

/**
 * Check if response indicates unauthorized (401) with "Unauthorized" message
 * @param response - Fetch Response object
 * @param data - Parsed JSON response data
 * @returns true if response is unauthorized
 */
export async function isUnauthorizedResponse(
  response: Response,
  data?: any
): Promise<boolean> {
  // Check HTTP status 401
  if (response.status === 401) {
    return true;
  }

  // If data not provided, try to parse it
  if (!data) {
    try {
      data = await response.json();
    } catch {
      return false;
    }
  }

  // Check for "Unauthorized" message in response
  if (data?.success === false && data?.message === "Unauthorized") {
    return true;
  }

  return false;
}

/**
 * Wrapper for authenticated fetch requests that handles unauthorized responses
 * @param url - Request URL
 * @param options - Fetch options
 * @param router - Next.js router instance
 * @returns Response object
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  router?: any
): Promise<Response> {
  const response = await fetch(url, options);

  // Check if response is unauthorized
  if (response.status === 401 || response.headers.get("content-type")?.includes("application/json")) {
    try {
      const data = await response.clone().json();
      if (await isUnauthorizedResponse(response, data)) {
        if (router) {
          handleUnauthorized(router);
        } else {
          // Fallback if router not provided
          clearStoredAuth();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }
    } catch {
      // If parsing fails but status is 401, still handle it
      if (response.status === 401 && router) {
        handleUnauthorized(router);
      }
    }
  }

  return response;
}
