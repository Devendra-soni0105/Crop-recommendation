"use client";

import Head from "next/head";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      <Head>
        <title>Login | KrishiSmart</title>
      </Head>

      <Navbar />

      {/* Login Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 sm:p-10 relative z-10">
          <div className="text-center mb-8">
            <img src="/logo.png" alt="KrishiSmart Logo" className="w-16 h-16 rounded-2xl shadow-lg shadow-emerald-500/20 mx-auto mb-6 object-cover" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Sign in to save your farm profile and keep track of your crop predictions.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => signIn('google', { callbackUrl: '/profile' })}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-sm transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="you@example.com" />
              </div>
              <button type="button" className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                Continue with Email
              </button>
            </form>
          </div>
          
          <p className="mt-8 text-center text-sm text-slate-500">
            By continuing, you agree to KrishiSmart's <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
