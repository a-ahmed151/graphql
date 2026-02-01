import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, User, BarChart2, ScanLine, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    // We can use router hooks to determine active state if needed, 
    // currently just using basic Link usage which TanStack Router handles for active props.

    return (
        <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-50">
            {/* Glow backing */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full pointer-events-none"></div>

            <div className="relative bg-[#101e22]/90 backdrop-blur-xl border border-primary/30 rounded-full px-6 py-3 flex justify-between items-center shadow-lg shadow-black/50">

                {/* Home / Dashboard */}
                <Link
                    to="/"
                    activeProps={{ className: "text-primary" }}
                    inactiveProps={{ className: "text-slate-500 hover:text-white" }}
                    className="flex flex-col items-center gap-1 transition-colors"
                >
                    <div className="relative">
                        <LayoutDashboard className="w-6 h-6" />
                        {/* We could add active indicator logic here if not using activeProps for everything */}
                    </div>
                </Link>

                {/* Search (Placeholder) */}
                <button className="text-slate-500 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Search className="w-6 h-6" />
                </button>

                {/* Center Action (Scan) */}
                <div className="relative -top-6">
                    <button className="w-14 h-14 bg-[#101e22] border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_10px_theme('colors.primary')] text-white relative z-10 group overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_theme('colors.primary')]">
                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                        <ScanLine className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* Stats / Activity */}
                <button className="text-slate-500 hover:text-white transition-colors flex flex-col items-center gap-1">
                    <Bell className="w-6 h-6" />
                </button>

                {/* Profile */}
                <Link
                    to="/profile"
                    activeProps={{ className: "text-primary" }}
                    inactiveProps={{ className: "text-slate-500 hover:text-white" }}
                    className="flex flex-col items-center gap-1 transition-colors"
                >
                    <User className="w-6 h-6" />
                </Link>
            </div>
        </nav>
    );
}
