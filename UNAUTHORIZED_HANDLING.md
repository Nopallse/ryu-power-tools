# Unauthorized Error Handling - Implementation Summary

## 📋 Overview
Sistem untuk menangani error unauthorized (401) ketika token expired atau invalid, dengan auto-redirect ke login page.

## 🚀 Files Created/Updated

### 1. **api-client.ts** (NEW)
Location: `fe/app/lib/api-client.ts`

Utility functions untuk handle unauthorized responses:
- `handleUnauthorized(router)` - Bersihkan auth dan redirect ke login
- `isUnauthorizedResponse(response, data?)` - Deteksi unauthorized response
- `authenticatedFetch(url, options, router?)` - Fetch wrapper dengan auto-handling

### 2. **useUnauthorizedHandler.ts** (NEW)
Location: `fe/app/hooks/useUnauthorizedHandler.ts`

React Hook untuk component yang perlu handle unauthorized:
- `handleError(error, response?)` - Handle error dan deteksi unauthorized
- `handleResponse(response)` - Check response unauthorized
- `redirect()` - Manual redirect ke login

### 3. **products/page.tsx** (UPDATED)
Location: `fe/app/(admin)/admin/products/page.tsx`

**Contoh implementasi** di admin page:
- Import `useUnauthorizedHandler`
- Gunakan `handleError` di catch block
- Jika unauthorized, error sudah ditangani (auto-redirect)

---

## 💻 How to Use

### Untuk Admin Pages (Authenticated)

```tsx
'use client';

import { useUnauthorizedHandler } from '@/app/hooks/useUnauthorizedHandler';

const MyAdminPage = () => {
  const { auth } = useAuthGuard();
  const { message } = App.useApp();
  const { handleError } = useUnauthorizedHandler(); // ← ADD THIS
  
  const loadData = async () => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${auth!.token}` }
      });
      
      if (!response.ok) throw new Error('Failed to load');
      
      const data = await response.json();
      setData(data);
    } catch (error) {
      // ← Ini akan handle unauthorized dan auto-redirect
      const wasUnauth = await handleError(error);
      
      if (!wasUnauth) {
        message.error('Failed to load data');
      }
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
};
```

### Untuk API Functions

```ts
// lib/my-api.ts
import { useRouter } from 'next/navigation';

export async function getMyData(token: string, router?: any) {
  const response = await fetch(`${API_BASE}/data`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // Check unauthorized
  if (response.status === 401) {
    const data = await response.json();
    if (data?.message === "Unauthorized") {
      clearStoredAuth();
      if (router) router.push('/login');
      throw new Error('Unauthorized');
    }
  }

  if (!response.ok) throw new Error('Failed to fetch');

  return response.json();
}
```

### Untuk Manual Fetch dengan Router

```tsx
import { authenticatedFetch } from '@/app/lib/api-client';

const MyComponent = () => {
  const router = useRouter();
  
  const fetchData = async () => {
    try {
      const response = await authenticatedFetch(
        url,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify(data)
        },
        router // ← Auto-redirect jika unauthorized
      );
      
      if (!response.ok) throw new Error('Failed');
      return response.json();
    } catch (error) {
      // Unauthorized sudah ditangani oleh authenticatedFetch
      console.error(error);
    }
  };
};
```

---

## 🔄 Response Format yang Ditangani

Ketika token expired atau invalid:

```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null,
  "error": {
    "code": "HTTP_EXCEPTION"
  }
}
```

**HTTP Status:** 401

---

## ✅ Checklist Implementasi

- [x] Create `api-client.ts` dengan utility functions
- [x] Create `useUnauthorizedHandler.ts` hook
- [x] Update products page sebagai example
- [x] Create documentation

### TODO - Apply ke semua admin pages:
- [ ] categories/page.tsx
- [ ] blog/page.tsx (articles)
- [ ] catalogs/page.tsx
- [ ] service-centers/page.tsx
- [ ] dashboard/page.tsx

---

## 📌 Best Practices

1. **Always check unauthorized pertama kali** sebelum handle error lain
2. **Clear stored auth sebelum redirect** ke login
3. **Use try-catch** untuk semua async operations
4. **Show user message** hanya jika bukan unauthorized (sudah ditangani)
5. **Include token di Authorization header** untuk authenticated endpoints
6. **Jangan handle 401 untuk public endpoints** - mereka tidak perlu auth

---

## 🔗 Key Status Codes

| Code | Message | Action |
|------|---------|--------|
| 401  | Unauthorized | Clear auth + Redirect to /login |
| 403  | Forbidden | Show error message to user |
| 404  | Not Found | Show error message to user |
| 500  | Server Error | Show error message to user |

---

## 📚 References

- **Auth storage:** `fe/app/lib/auth-client.ts`
- **Existing API pattern:** `fe/app/lib/article-api.ts`, `product-api.ts`
- **Admin layout:** `fe/app/(admin)/layout.tsx`
- **Auth guard:** `fe/app/hooks/useAuthGuard.ts`
