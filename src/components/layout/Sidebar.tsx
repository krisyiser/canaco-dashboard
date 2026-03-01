'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Briefcase, DollarSign, Settings, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { logout } from '@/app/actions/auth';

const navItems = [
    { icon: Home, label: 'Dashboard', href: '/', roles: ['presidente', 'consejo'] },
    { icon: Users, label: 'Padrón CANACO', href: '/socios/canaco', roles: ['presidente', 'oficina'] },
    { icon: Briefcase, label: 'Padrón SIEM', href: '/socios/siem', roles: ['presidente', 'oficina'] },
    { icon: DollarSign, label: 'Finanzas', href: '/finanzas', roles: ['presidente', 'oficina'] },
    { icon: Settings, label: 'Configuración', href: '/configuracion', roles: ['presidente'] },
];

const NavContent = ({ pathname, setOpen, role }: { pathname: string, setOpen: (open: boolean) => void, role?: string }) => {
    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname?.startsWith(href);
    };

    const allowedItems = navItems.filter(item => !role || item.roles.includes(role));

    return (
        <div className="flex flex-col gap-2 p-4 h-full bg-slate-900 text-slate-100">
            <div className="mb-4 mt-2 px-2 flex flex-col items-center justify-center border-b border-slate-800 pb-6">
                <img src="/canaco.png" alt="CANACO" className="h-16 w-auto mb-2 object-contain" />
                <h2 className="text-xl font-bold text-amber-500 tracking-tight">CANACO</h2>
                {role && <span className="text-xs text-slate-400 font-medium capitalize mt-1 border border-slate-700 bg-slate-800 px-3 py-1 rounded-full">{role}</span>}
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
                {allowedItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                            <span className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium",
                                active
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                            )}>
                                <item.icon className={cn("w-5 h-5", active ? "text-amber-500" : "text-slate-400")} />
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto px-2 pt-4 border-t border-slate-800 flex flex-col gap-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                    onClick={() => logout()}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                </Button>
                <div className="text-xs text-center text-slate-500 mt-2">
                    Dashboard Empresarial v2.0
                </div>
            </div>
        </div>
    );
};

export function Sidebar({ role }: { role?: string }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="md:hidden flex flex-row items-center p-4 border-b bg-slate-900 border-slate-800 w-full fixed top-0 z-50">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-100 hover:bg-slate-800">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-900 border-r-slate-800 w-64 flex flex-col">
                        <NavContent pathname={pathname} setOpen={setOpen} role={role} />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 flex items-center gap-2">
                    <img src="/canaco.png" alt="CANACO" className="h-6 w-auto object-contain" />
                    <span className="text-lg font-bold text-amber-500">CANACO</span>
                </div>
            </div>

            {/* Spacer for mobile fixed header */}
            <div className="md:hidden w-full h-16" />

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col w-64 h-screen border-r border-slate-800 bg-slate-900 fixed left-0 top-0 z-40">
                <NavContent pathname={pathname} setOpen={setOpen} role={role} />
            </div>
        </>
    );
}
