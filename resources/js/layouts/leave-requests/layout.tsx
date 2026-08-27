import { LeaveRequestTopNav } from '@/components/leave-request-top-nav';

export default function LeaveRequestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <LeaveRequestTopNav />
            <main>{children}</main>
        </div>
    );
}
