import { Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ManagedUser } from '../types';

export function UsersTable({
    users,
    currentUserId,
    activeAdministratorCount,
    onView,
    onEdit,
    onToggleActivation,
    togglingUserId,
}: {
    users: ManagedUser[];
    currentUserId: number;
    activeAdministratorCount: number;
    onView: (user: ManagedUser) => void;
    onEdit: (user: ManagedUser) => void;
    onToggleActivation: (user: ManagedUser) => void;
    togglingUserId: number | null;
}) {
    return (
        <Card className="overflow-hidden border-[#E7E5E4] bg-white py-0">
            <CardContent className="overflow-x-auto p-0">
                <table className="w-full min-w-225 text-left text-sm">
                    <thead className="border-b border-[#E7E5E4] bg-[#F5F5F4] text-xs font-medium text-[#57534E]">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E5E4]">
                        {users.map((user) => {
                            const canToggleActivation =
                                !user.is_active ||
                                (user.id !== currentUserId &&
                                    !(
                                        user.role === 'administrator' &&
                                        activeAdministratorCount <= 1
                                    ));

                            return (
                                <tr key={user.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#292524]">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-[#78716C]">
                                            {user.email}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-[#57534E]">
                                        {user.role === 'administrator'
                                            ? 'Administrator'
                                            : 'Employee'}
                                    </td>
                                    <td className="px-6 py-4 text-[#57534E]">
                                        {new Intl.DateTimeFormat(undefined, {
                                            dateStyle: 'medium',
                                        }).format(new Date(user.created_at))}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={user.is_active}
                                                aria-label={`${user.is_active ? 'Deactivate' : 'Activate'} ${user.first_name} ${user.last_name}`}
                                                title={
                                                    canToggleActivation
                                                        ? undefined
                                                        : 'This account cannot be deactivated.'
                                                }
                                                disabled={
                                                    !canToggleActivation ||
                                                    togglingUserId === user.id
                                                }
                                                onClick={() =>
                                                    onToggleActivation(user)
                                                }
                                                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-[#D6D3D1]/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#639922] data-[state=unchecked]:bg-[#D6D3D1]"
                                                data-state={
                                                    user.is_active
                                                        ? 'checked'
                                                        : 'unchecked'
                                                }
                                            >
                                                <span
                                                    className={
                                                        user.is_active
                                                            ? 'pointer-events-none inline-block size-5 translate-x-5 rounded-full bg-white shadow-sm transition-transform'
                                                            : 'pointer-events-none inline-block size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform'
                                                    }
                                                />
                                            </button>
                                            <span className="text-sm text-[#57534E]">
                                                {user.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                                onClick={() => onView(user)}
                                            >
                                                <Eye />
                                                View
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                                onClick={() => onEdit(user)}
                                            >
                                                <Pencil />
                                                Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
