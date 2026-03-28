import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-white text-[#1b1b18] flex flex-col font-sans selection:bg-[#162a5b]/10">
            <Head title="Project IMS - Enterprise Resource Planning" />

            <nav className="flex items-center justify-between p-6 lg:px-12 w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-2 group">
                    <div className="size-10 bg-[#162a5b] rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-900/10 group-hover:rotate-12 transition-transform duration-500">
                        <AppLogoIcon className="size-6 fill-current" />
                    </div>
                    <span className="text-xl font-black text-[#162a5b] tracking-tighter uppercase italic">Project IMS</span>
                </div>

                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <Link href={dashboard()} className="px-5 py-2 bg-[#162a5b] text-white rounded-lg font-bold text-xs shadow-lg shadow-blue-900/10 hover:bg-[#1c3a7a] transition-all uppercase tracking-wider">
                            Dashboard
                        </Link>
                    ) : (
                        <Link href={login()} className="px-5 py-2 border border-[#162a5b] text-[#162a5b] rounded-lg font-bold text-xs hover:bg-[#162a5b] hover:text-white transition-all uppercase tracking-wider">
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000">
                <div className="mb-8 p-3 bg-blue-50 text-[#162a5b] rounded-full text-[10px] font-black tracking-[0.2em] uppercase px-6">
                    Professional Inventory Management
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-[#162a5b] tracking-tighter uppercase italic leading-tight mb-6">
                    Simplify Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#162a5b] to-blue-600">Operations</span>
                </h1>
                <p className="max-w-2xl text-slate-500 text-lg font-medium mb-12 leading-relaxed">
                    The next-generation platform for managing stocks, purchases, and sales.
                    Built for efficiency, designed for scale.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href={login()} className="min-w-[200px] px-8 py-4 bg-[#162a5b] text-white rounded-xl font-black italic uppercase tracking-tighter text-lg shadow-2xl shadow-blue-900/20 hover:translate-y-[-2px] active:translate-y-0 transition-all text-center">
                        Get Started
                    </Link>
                    <button className="min-w-[200px] px-8 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-black italic uppercase tracking-tighter text-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                        Book a Demo
                    </button>
                </div>
            </main>

            <footer className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-t border-slate-50">
                &copy; {new Date().getFullYear()} Project IMS. All Rights Reserved.
            </footer>
        </div>
    );
}
