import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings, Tags } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="h-screen bg-zinc-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <span className="font-display text-xl font-extrabold tracking-[0.15em] text-black">
            ROUHI ADMIN
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-zinc-500" />
            Overview
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <ShoppingBag className="w-5 h-5 text-zinc-400" />
            Orders
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <Package className="w-5 h-5 text-zinc-400" />
            Products
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <Tags className="w-5 h-5 text-zinc-400" />
            Categories
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors">
            <Settings className="w-5 h-5 text-zinc-400" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#C5A059] flex items-center justify-center text-white font-bold">
              {session.user.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-end px-8 flex-shrink-0">
           <LogoutButton />
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
