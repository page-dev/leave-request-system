import { Head, router, usePage } from '@inertiajs/react';
import { Search, UserPlus, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { toggleActivation } from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SummaryCard } from '@/pages/leave-requests/components/summary-card';
import { index as usersIndex } from '@/routes/admin/users';
import { EditUserDialog } from './components/edit-user-dialog';
import { NewUserDialog } from './components/new-user-dialog';
import { UsersTable } from './components/users-table';
import { ViewUserDialog } from './components/view-user-dialog';
import type { ManagedUser, UserRole, UserStatus } from './types';

const allFilters = 'all';

export default function UsersIndex({
    users,
    filters,
    activeAdministratorCount,
}: {
    users: ManagedUser[];
    filters: {
        search: string | null;
        status: UserStatus | null;
        role: UserRole | null;
    };
    activeAdministratorCount: number;
}) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? allFilters);
    const [role, setRole] = useState(filters.role ?? allFilters);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [userToView, setUserToView] = useState<ManagedUser | null>(null);
    const [userToEdit, setUserToEdit] = useState<ManagedUser | null>(null);
    const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

    const activeUserCount = users.filter((user) => user.is_active).length;
    const inactiveUserCount = users.length - activeUserCount;
    const filteredActiveAdministratorCount = users.filter(
        (user) => user.is_active && user.role === 'administrator',
    ).length;

    const updateFilters = (
        nextStatus: string,
        nextRole: string,
        nextSearch = search,
    ) => {
        setStatus(nextStatus);
        setRole(nextRole);
        setSearch(nextSearch);
        router.get(
            usersIndex.url({
                query: {
                    search: nextSearch.trim() || undefined,
                    status: nextStatus === allFilters ? undefined : nextStatus,
                    role: nextRole === allFilters ? undefined : nextRole,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const toggleUserActivation = (user: ManagedUser) => {
        setTogglingUserId(user.id);
        router.patch(
            toggleActivation.url(user),
            {},
            {
                preserveScroll: true,
                onFinish: () => setTogglingUserId(null),
            },
        );
    };

    const hasActiveFilters =
        status !== allFilters || role !== allFilters || search !== '';

    return (
        <>
            <Head title="Users" />
            <main className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SummaryCard
                            label="Active users"
                            value={activeUserCount}
                        />
                        <SummaryCard
                            label="Inactive users"
                            value={inactiveUserCount}
                        />
                        <SummaryCard
                            label="Active administrators"
                            value={filteredActiveAdministratorCount}
                        />
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                                User management
                            </h1>
                            <p className="mt-1 text-sm text-[#78716C]">
                                Create, update, and manage account access.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                            <form
                                className="grid gap-1.5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    updateFilters(status, role, search);
                                }}
                            >
                                <label
                                    htmlFor="user-search"
                                    className="text-xs font-medium text-[#78716C]"
                                >
                                    Search users
                                </label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#78716C]" />
                                    <Input
                                        id="user-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Name or email"
                                        className="w-52 border-[#E7E5E4] bg-white pr-3 pl-9 text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    />
                                </div>
                            </form>
                            <FilterSelect
                                label="Status"
                                value={status}
                                onValueChange={(nextStatus) =>
                                    updateFilters(nextStatus, role)
                                }
                            >
                                <SelectItem value={allFilters}>
                                    All statuses
                                </SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </FilterSelect>
                            <FilterSelect
                                label="Role"
                                value={role}
                                onValueChange={(nextRole) =>
                                    updateFilters(status, nextRole)
                                }
                            >
                                <SelectItem value={allFilters}>
                                    All roles
                                </SelectItem>
                                <SelectItem value="employee">
                                    Employee
                                </SelectItem>
                                <SelectItem value="administrator">
                                    Administrator
                                </SelectItem>
                            </FilterSelect>
                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                    onClick={() =>
                                        updateFilters(
                                            allFilters,
                                            allFilters,
                                            '',
                                        )
                                    }
                                >
                                    Clear filters
                                </Button>
                            )}
                            <Button
                                className="bg-black text-white hover:bg-[#292524]"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <UserPlus />
                                New user
                            </Button>
                        </div>
                    </div>

                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E7E5E4] bg-white px-6 py-16 text-center shadow-sm">
                            <div className="rounded-full bg-[#F5F5F4] p-3 text-[#57534E]">
                                <UsersRound className="size-6" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[#1C1917]">
                                    No users found
                                </h2>
                                <p className="mt-1 text-sm text-[#78716C]">
                                    Try changing the filters or create a new
                                    user account.
                                </p>
                            </div>
                            <Button
                                className="bg-black text-white hover:bg-[#292524]"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <UserPlus />
                                New user
                            </Button>
                        </div>
                    ) : (
                        <UsersTable
                            users={users}
                            currentUserId={auth.user?.id ?? 0}
                            activeAdministratorCount={activeAdministratorCount}
                            onView={setUserToView}
                            onEdit={setUserToEdit}
                            onToggleActivation={toggleUserActivation}
                            togglingUserId={togglingUserId}
                        />
                    )}
                </div>
            </main>

            <NewUserDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            <ViewUserDialog
                user={userToView}
                currentUserId={auth.user?.id ?? 0}
                activeAdministratorCount={activeAdministratorCount}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setUserToView(null);
                    }
                }}
            />
            <EditUserDialog
                user={userToEdit}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setUserToEdit(null);
                    }
                }}
            />
        </>
    );
}

function FilterSelect({
    label,
    value,
    onValueChange,
    children,
}: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}) {
    const id = `user-${label.toLowerCase()}`;

    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-xs font-medium text-[#78716C]">
                {label}
            </label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    id={id}
                    className="w-40 border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#E7E5E4] bg-white text-[#292524]">
                    {children}
                </SelectContent>
            </Select>
        </div>
    );
}
