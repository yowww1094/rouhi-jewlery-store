'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Something went wrong!</h1>
            <p className="text-sm text-gray-500">
              A critical error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              className="px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
