"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredAuth, validateToken, clearStoredAuth, type AuthSession } from "@/app/lib/auth-client";

const DEFAULT_BYPASS = ["/log8i8n738"];

export function useAuthGuard(bypassPaths: string[] = DEFAULT_BYPASS) {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  const allowedWithoutAuth = useMemo(() => {
    if (!pathname) return false;
    return bypassPaths.some((path) => pathname.startsWith(path));
  }, [pathname, bypassPaths]);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const session = getStoredAuth();

      if (!session && !allowedWithoutAuth) {
        router.replace("/log8i8n738");
        if (isMounted) {
          setAuth(null);
          setReady(true);
        }
        return;
      }

      if (session && !allowedWithoutAuth) {
        const isValid = await validateToken(session.token);
        if (!isValid) {
          clearStoredAuth();
          router.replace("/log8i8n738");
          if (isMounted) {
            setAuth(null);
            setReady(true);
          }
          return;
        }
      }

      if (isMounted) {
        setAuth(session);
        setReady(true);
      }
    };

    setReady(false);
    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, allowedWithoutAuth, router]);

  return { auth, ready, allowedWithoutAuth };
}
