import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    Settings,
    ShieldCheck,
    Tags,
    UsersRound,
} from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as leaveRequestsIndex } from '@/routes/admin/leave-requests';
import { index as leaveTypesIndex } from '@/routes/admin/leave-types';
import { general } from '@/routes/admin/settings';
import { index as usersIndex } from '@/routes/admin/users';

export function AdminSidebar() {
    const { url } = usePage();

    return (
        <Sidebar collapsible="icon" className="border-[#E7E5E4]">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={leaveRequestsIndex()} prefetch>
                                <ShieldCheck />
                                <span className="font-semibold">
                                    Administration
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={url.startsWith('/admin/users')}
                                >
                                    <Link href={usersIndex()} prefetch>
                                        <UsersRound />
                                        <span>Users</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={url.startsWith(
                                        '/admin/leave-requests',
                                    )}
                                >
                                    <Link href={leaveRequestsIndex()} prefetch>
                                        <ClipboardList />
                                        <span>Requests list</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={url.startsWith(
                                        '/admin/leave-types',
                                    )}
                                >
                                    <Link href={leaveTypesIndex()} prefetch>
                                        <Tags />
                                        <span>Leave types</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={url.startsWith('/admin/settings')}
                                >
                                    <Link href={general()} prefetch>
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
