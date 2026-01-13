/**
 * UNAUTHORIZED ERROR HANDLING GUIDE
 * 
 * This guide explains how to handle unauthorized errors (401 Unauthorized)
 * when token expires or is invalid.
 * 
 * =====================================================
 * IMPLEMENTATION IN COMPONENTS
 * =====================================================
 * 
 * 1. For Admin Pages (authenticated):
 *    Use the useUnauthorizedHandler hook in useEffect catch blocks
 * 
 *    Example:
 *    ```tsx
 *    'use client';
 *    
 *    import { useUnauthorizedHandler } from '@/app/hooks/useUnauthorizedHandler';
 *    
 *    const MyAdminPage = () => {
 *      const { handleError, handleResponse } = useUnauthorizedHandler();
 *      
 *      useEffect(() => {
 *        (async () => {
 *          try {
 *            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
 *            
 *            // Check if response is unauthorized
 *            const isUnauth = await handleResponse(response);
 *            if (isUnauth) return;
 *            
 *            if (!response.ok) throw new Error('Failed to fetch');
 *            const data = await response.json();
 *            // ... handle data
 *          } catch (error) {
 *            const wasUnauth = await handleError(error, response);
 *            if (!wasUnauth) {
 *              message.error('Failed to load data');
 *            }
 *          }
 *        })();
 *      }, [handleError, handleResponse]);
 *    };
 *    ```
 * 
 * 2. For API Functions (in lib/):
 *    Parse response and check for unauthorized
 *    
 *    Example:
 *    ```ts
 *    // api-client.ts
 *    export async function checkUnauthorizedAndRedirect(
 *      response: Response,
 *      router: any
 *    ): Promise<boolean> {
 *      if (response.status === 401) {
 *        try {
 *          const data = await response.clone().json();
 *          if (data?.message === "Unauthorized") {
 *            clearStoredAuth();
 *            router.push("/login");
 *            return true;
 *          }
 *        } catch {}
 *      }
 *      return false;
 *    }
 *    ```
 * 
 * 3. For Both Component and API:
 *    Use the authenticatedFetch wrapper function
 *    
 *    Example:
 *    ```tsx
 *    import { authenticatedFetch } from '@/app/lib/api-client';
 *    
 *    const response = await authenticatedFetch(
 *      url,
 *      {
 *        method: 'GET',
 *        headers: { Authorization: `Bearer ${token}` }
 *      },
 *      router // Optional: for automatic redirect
 *    );
 *    ```
 * 
 * =====================================================
 * RESPONSE STRUCTURE FOR UNAUTHORIZED
 * =====================================================
 * 
 * When token expires or is invalid, backend returns:
 * ```json
 * {
 *   "success": false,
 *   "message": "Unauthorized",
 *   "data": null,
 *   "error": {
 *     "code": "HTTP_EXCEPTION"
 *   }
 * }
 * ```
 * 
 * HTTP Status: 401
 * 
 * =====================================================
 * UTILITY FUNCTIONS AVAILABLE
 * =====================================================
 * 
 * From api-client.ts:
 * - handleUnauthorized(router) - Handle unauthorized, clear auth, redirect
 * - isUnauthorizedResponse(response, data?) - Check if response is unauthorized
 * - authenticatedFetch(url, options, router?) - Fetch wrapper with auto-redirect
 * 
 * From hooks/useUnauthorizedHandler.ts:
 * - useUnauthorizedHandler() - Hook with handleError, handleResponse, redirect
 * 
 * =====================================================
 * BEST PRACTICES
 * =====================================================
 * 
 * 1. Always check response status 401 or message "Unauthorized"
 * 2. Use try-catch to handle async operations
 * 3. Clear stored auth before redirecting to login
 * 4. Show error message to user if handling manually
 * 5. For authenticated API calls, always include token
 * 6. For public endpoints, don't handle 401 (they shouldn't get it)
 * 
 * =====================================================
 * EXAMPLE: UPDATE ADMIN PAGE WITH UNAUTHORIZED HANDLING
 * =====================================================
 * 
 * const ProductsPage = () => {
 *   const { auth } = useAuthGuard();
 *   const { message } = App.useApp();
 *   const { handleError, handleResponse } = useUnauthorizedHandler();
 * 
 *   const loadProducts = async () => {
 *     try {
 *       const response = await fetch(url, {
 *         headers: { Authorization: `Bearer ${auth!.token}` }
 *       });
 *       
 *       // Check unauthorized before other checks
 *       if (await handleResponse(response)) return;
 *       
 *       if (!response.ok) throw new Error('Failed to load products');
 *       
 *       const result = await response.json();
 *       setProducts(result.data || result);
 *     } catch (error) {
 *       // handleError returns true if it was unauthorized (already handled)
 *       const wasUnauth = await handleError(error);
 *       if (!wasUnauth) {
 *         message.error('Failed to load products');
 *       }
 *     }
 *   };
 * 
 *   return (...);
 * };
 * 
 */

export {};
