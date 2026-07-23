"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page-bg bg-red-800">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-brand/80">
        Oops! Page not found
      </h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-brand text-brand-light rounded-lg shadow hover:bg-brand-dark transition"
      >
        Return Home
      </Link>
    </div>
  );
}
