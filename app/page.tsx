"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Asset Heaven Admin</h1>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
      </div>
    </div>
  );
}
