"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  handleUnauthorized as handleUnauthorizedUtil,
  isUnauthorizedResponse,
} from "@/app/lib/api-client";

/**
 * Hook to handle unauthorized errors and redirect to login
 * Use this in components that make authenticated API calls
 */
export function useUnauthorizedHandler() {
  const router = useRouter();

  const handleError = useCallback(
    async (error: unknown, response?: Response) => {
      // Check if response indicates unauthorized
      if (response) {
        const isUnauthorized = await isUnauthorizedResponse(response);
        if (isUnauthorized) {
          handleUnauthorizedUtil(router);
          return true;
        }
      }

      // Check if error message indicates unauthorized
      if (error instanceof Error) {
        if (
          error.message === "Unauthorized" ||
          error.message.includes("token") ||
          error.message.includes("unauthorized")
        ) {
          handleUnauthorizedUtil(router);
          return true;
        }
      }

      return false;
    },
    [router]
  );

  const handleResponse = useCallback(
    async (response: Response) => {
      const isUnauthorized = await isUnauthorizedResponse(response);
      if (isUnauthorized) {
        handleUnauthorizedUtil(router);
      }
      return isUnauthorized;
    },
    [router]
  );

  return {
    handleError,
    handleResponse,
    redirect: () => handleUnauthorizedUtil(router),
  };
}
