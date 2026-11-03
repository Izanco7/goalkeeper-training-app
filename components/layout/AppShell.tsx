import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

interface AppShellProps {
  navItems: NavItem[];
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  children: React.ReactNode;
}

export function AppShell({
  navItems,
  userName,
  userEmail,
  onLogout,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navWithActive = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        active: pathname?.startsWith(item.href),
      })),
    [navItems, pathname]
  );

  return (
    <div className="min-h-screen flex bg-[#0a0f0d] text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-40 bg-black border-r border-white/10 z-40 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-4 flex items-center gap-2.5 border-b border-white/10">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-black font-black text-sm">GK</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight leading-tight">Goalkeeper</span>
            <span className="text-sm font-extrabold tracking-tight leading-tight text-lime-400">Training</span>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-sm font-bold truncate">{userName}</p>
          <p className="text-xs text-white/40 truncate">{userEmail}</p>
        </div>

        <nav className="px-2 py-4 space-y-1 overflow-y-auto h-[calc(100vh-260px)]">
          {navWithActive.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                item.active
                  ? 'bg-lime-400/10 text-lime-300 border border-lime-400/20'
                  : 'text-white/55 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <span className={`w-5 h-5 ${item.active ? 'text-lime-300' : 'text-white/35'}`}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-white/10 space-y-2">
          <LanguageSwitcher />
          {onLogout && (
            <button
              className="w-full text-sm font-bold py-2 px-3 rounded-xl border border-white/15 text-white/70 hover:border-red-400/50 hover:text-red-300 transition-colors"
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-40">
        <header className="sticky top-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
            <button
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>            
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 lg:px-8 py-4">{children}</main>
      </div>
    </div>
  );
}
