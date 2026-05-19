"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/", "/login"];

function AuthGuard({ children }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // If unauthenticated and trying to access a protected route
    if (status === "unauthenticated" && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }
    
    // If authenticated and trying to access login page, redirect to home/profile
    if (status === "authenticated" && pathname === "/login") {
      router.push("/profile");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Prevent flashing protected content before redirect
  if (status === "unauthenticated" && !publicRoutes.includes(pathname)) {
    return null; 
  }

  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </SessionProvider>
  );
}
