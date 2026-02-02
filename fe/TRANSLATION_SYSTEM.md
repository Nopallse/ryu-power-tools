# Frontend Translation System - Ryu Power Tools

## 📋 Overview

Sistem ini menggunakan **MyMemory Translation API** untuk translate data dinamis dari database ke bahasa yang dipilih user, sementara text statis tetap menggunakan **i18n**.

### Arsitektur:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Next.js)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Static Content (i18n)     Dynamic Content (from DB)        │
│  ├─ Navigation            ├─ Product name/description      │
│  ├─ Labels                ├─ Article content                │
│  ├─ Buttons               ├─ User input                     │
│  └─ Messages              └─ Custom data                    │
│         │                        │                          │
│         ├────────────┬───────────┤                          │
│                      │                                       │
│                  Language Selector                          │
│                      │                                       │
│         ┌────────────┴───────────┐                          │
│         │                        │                          │
│      i18n.ts              useTranslatedData()               │
│    (Static trans)        (MyMemory Translate)               │
│                                 │                          │
│                        MyMemory API / Cache                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘

NO Backend Changes! ✅
```

## 🚀 Implementasi

### 1. **URL Structure dengan Language Parameter**

Domain mendukung parameter bahasa:
- `https://domain.com/en/...` - English
- `https://domain.com/id/...` atau `https://domain.com/in/...` - Indonesian

**Middleware** (`middleware.ts`) secara otomatis:
- Mendeteksi parameter bahasa dari URL
- Memetakan `in` → `id` untuk kemudahan
- Menyimpan preferensi bahasa ke cookie
- Redirect ke bahasa default jika tidak ada parameter

### 2. **Files yang Dibuat**

- **[middleware.ts](./middleware.ts)** - Handle URL language routing
- **[app/lib/google-translate-api.ts](./app/lib/google-translate-api.ts)** - Utility untuk translate
- **[app/hooks/useTranslatedData.ts](./app/hooks/useTranslatedData.ts)** - React hook untuk data dinamis
- **[app/providers/LanguageProvider.tsx](./app/providers/LanguageProvider.tsx)** - Updated dengan URL sync

### 3. **Cara Penggunaan**

#### A. Static Content (Gunakan i18n)

```tsx
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t.nav.home}</h1>
      <p>{t.nav.about}</p>
    </div>
  );
}
```

#### B. Dynamic Content (Gunakan useTranslatedData)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslatedData } from '@/app/hooks/useTranslatedData';

interface Product {
  id: string;
  name: string;
  description: string;
  specifications: string;
}

export default function ProductPage() {
  const { language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  
  // Fetch product dari API (dalam bahasa English original)
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch('/api/products/123');
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, []);

  // Translate hanya field tertentu, otomatis saat language berubah
  const { translated: translatedProduct, isLoading } = useTranslatedData(
    product,
    language,
    ['name', 'description', 'specifications'] // Fields to translate
  );

  return (
    <div>
      {isLoading && <p>Translating...</p>}
      
      <h1>{translatedProduct?.name}</h1>
      <p>{translatedProduct?.description}</p>
      <div>{translatedProduct?.specifications}</div>
    </div>
  );
}
```

### 4. **Language Switching**

```tsx
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div>
      <button 
        onClick={() => setLanguage('en')}
        className={language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => setLanguage('id')}
        className={language === 'id' ? 'active' : ''}
      >
        Indonesian
      </button>
    </div>
  );
}
```

## 📊 Fitur Utama

✅ **Automatic URL Routing** - Detect & sync bahasa dari URL parameter
✅ **Automatic Caching** - Tidak perlu translate ulang  
✅ **No Backend Changes** - Pure frontend solution  
✅ **Rate Limit Safe** - Ada delay built-in (100ms per field)  
✅ **Smart Field Selection** - Hanya translate field yang perlu  
✅ **Fallback Handling** - Jika error, gunakan original text  
✅ **Language-aware** - Skip translate jika language = 'en'  
✅ **CORS Safe** - Menggunakan MyMemory API yang support CORS  
✅ **Support `in` alias** - `in` otomatis di-map ke `id`

## 📊 Performance

| Metric | Value | Catatan |
|--------|-------|---------|
| First Load | ~2-5s | Tergantung network & data size |
| Cached Load | <100ms | Dari cache |
| Translation Delay | 100ms/field | Built-in rate limit |
| Cache Size | Unlimited | Per session (cleared on refresh) |

## 🔍 Debugging

### Cek cache size:
```typescript
import { getCacheSize, clearTranslationCache } from '@/app/lib/google-translate-api';

console.log('Cache entries:', getCacheSize());
clearTranslationCache(); // Clear jika perlu
```

### Lihat console logs:
```
🔄 Translating to id, fields: ['name', 'description']
✅ Translation complete for id {...}
```

## 🌍 URL Examples

### Navigasi dengan Language Parameter

```
/en/blog               → English Blog
/id/blog               → Indonesian Blog
/in/blog               → Indonesian Blog (alias)
/en/blog/article-1     → English Single Article
/id/product/123        → Indonesian Product Detail
```

### Default Behavior

- Jika user akses `/blog` tanpa parameter bahasa
- Middleware akan redirect ke `/en/blog` (default English)
- Atau ke `/id/blog` jika ada cookie `lang=id`

## ⚙️ API Details

### useTranslatedData Hook

```typescript
useTranslatedData<T>(
  data: T | null | undefined,
  targetLanguage: Language,
  fieldsToTranslate?: string[]
): {
  translated: T | null,
  isLoading: boolean,
  error: string | null
}
```

**Parameters:**
- `data` - Object dengan data yang perlu ditranslate
- `targetLanguage` - Target bahasa ('en' atau 'id')
- `fieldsToTranslate` - (Optional) Array nama field yang perlu ditranslate

**Returns:**
- `translated` - Data setelah ditranslate
- `isLoading` - Loading state selama proses translate
- `error` - Error message jika ada

### translateObject Function

```typescript
translateObject<T extends Record<string, any>>(
  obj: T,
  targetLanguage: string,
  sourceLanguage?: string,
  fieldsToTranslate?: string[]
): Promise<T>
```

### Language Context

```typescript
interface LanguageContextType {
  language: Language;           // Current language ('en' | 'id')
  t: Translations;              // Static translations
  setLanguage: (lang: Language) => void;  // Change language
  isLoading: boolean;           // Loading state
}
```

## 🎯 Best Practices

1. **Pisahkan Static dan Dynamic Content**
   - Static: Gunakan i18n (navigation, labels, buttons)
   - Dynamic: Gunakan useTranslatedData (product names, descriptions)

2. **Cache Management**
   - Tidak perlu clear cache manual, otomatis per session
   - Jika perlu reset: `clearTranslationCache()`

3. **Rate Limiting**
   - Sudah built-in dengan 100ms delay per field
   - Aman untuk API rate limiting

4. **Error Handling**
   - Hook otomatis fallback ke original text jika error
   - Check `error` prop untuk debugging

5. **Performance**
   - Translate hanya field yang perlu, jangan semua
   - Gunakan `fieldsToTranslate` array untuk optimize

## 🐛 Troubleshooting

### Translation tidak bekerja?
- Check browser console untuk log 🔄 dan ✅
- Pastikan `targetLanguage` bukan 'en'
- Verify field names ada di object

### Cache tidak clear?
- Manual clear: `clearTranslationCache()`
- Atau refresh page (cache per session)

### URL tidak berubah saat language switch?
- Check middleware.ts sudah benar
- Pastikan LanguageProvider wrap seluruh app
- Verify `useRouter` dari 'next/navigation'

## 📝 Contoh Implementation

Lihat folder [app/[lang]](./app/[lang]) untuk contoh lengkap penggunaan di real page components.
