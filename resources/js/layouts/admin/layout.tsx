import { AdminSidebar } from '@/components/admin-sidebar';
import { AppShell } from '@/components/app-shell';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppShell>
            <AdminSidebar />
            <SidebarInset className="bg-[#FAF9F6]">
                <header className="flex h-16 items-center gap-3 border-b border-[#E7E5E4] bg-white px-4 md:hidden">
                    <SidebarTrigger />
                    <span className="text-sm font-semibold text-[#1C1917]">
                        Administration
                    </span>
                </header>
                {children}
            </SidebarInset>
        </AppShell>
    );
}
