"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "My Predictions", href: "/top-crops", protected: true },
    { name: "Weather", href: "/weather", protected: true },
    { name: "Krishi AI", href: "/chat", protected: true },
    { name: "Predict Crop", href: "/predict", protected: true },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="KrishiSmart Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-emerald-500/20 object-cover" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Krishi<span className="text-emerald-600">Smart</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.protected && !session) return null;
              
              const isActive = pathname === link.href;
              
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-[15px] font-bold transition-all ${
                    isActive 
                    ? "text-emerald-600" 
                    : "text-slate-600 hover:text-emerald-500"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {session ? (
              <div className="flex items-center gap-4 pl-2">
                <Link href="/profile" className="flex items-center gap-3 transition-all group">
                  <div className="flex flex-col items-end">
                    <span className={`text-[15px] font-bold leading-none transition-colors ${pathname === '/profile' ? 'text-emerald-600' : 'text-slate-900 group-hover:text-emerald-600'}`}>{session.user?.name}</span>
                  </div>
                  {session.user?.image ? (
                    <img src={session.user.image.replace('=s96-c', '=s200-c')} alt="User" className="w-9 h-9 rounded-full border border-slate-200 group-hover:border-emerald-200 transition-colors shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-[14px] transition-all shadow-md shadow-slate-200 active:scale-95"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
