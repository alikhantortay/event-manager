'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar, Heart } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Все мероприятия', icon: Calendar },
    { href: '/favorites', label: 'Избранное', icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-black/5 shadow-sm shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex w-full items-center justify-between sm:justify-start">
            <Link href="/" className="flex flex-shrink-0 items-center gap-3 transition-transform hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                EventManager
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-2">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 mt-3 mb-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === href
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="sm:hidden border-t border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="flex justify-around py-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors',
                pathname === href
                  ? 'text-indigo-600 bg-indigo-50 border border-indigo-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
