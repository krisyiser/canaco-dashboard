'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export function ClientLayout({ children, role }: { children: ReactNode; role?: string }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <main className="flex-1 w-full min-h-screen flex">{children}</main>;
    }

    return (
        <>
            <Sidebar role={role} />
            <main className="flex-1 md:ml-64 p-4 lg:p-8 pt-4 pb-20 md:pb-8 overflow-x-hidden overflow-y-auto w-full md:w-[calc(100%-16rem)] min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col">
                {children}
            </main>
        </>
    );
}
