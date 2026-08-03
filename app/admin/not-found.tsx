import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-gray-200 m-6 shadow-sm">
      <div className="text-6xl font-black text-gray-100 mb-4 tracking-tighter">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-gray-500 max-w-md text-sm mx-auto mb-8">
        The dashboard page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/admin"
        className="px-6 py-2 bg-black text-white hover:bg-zinc-800 transition-colors text-sm font-medium rounded-lg"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
