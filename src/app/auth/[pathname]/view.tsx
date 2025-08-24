"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthView({ pathname }: { pathname: string }) {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <main className="flex items-center justify-center md:p-4 md:pt-32">
      {pathname === "sign-in" || pathname === "sign-up" ? (
        <AuthForm pathname={pathname} />
      ) : (
        ""
      )}
    </main>
  );
}
