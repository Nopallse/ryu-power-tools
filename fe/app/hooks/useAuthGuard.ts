"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredAuth, type AuthSession } from "@/app/lib/auth-client";

const DEFAULT_BYPASS = ["/login"];

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
    const session = getStoredAuth();
    console.log('useAuthGuard - getStoredAuth result:', session);
    if (!session && !allowedWithoutAuth) {
      router.replace("/login");
      setReady(true);
      return;
    }
    setAuth(session);
    setReady(true);
  }, [allowedWithoutAuth, router]);

  return { auth, ready, allowedWithoutAuth };
}
