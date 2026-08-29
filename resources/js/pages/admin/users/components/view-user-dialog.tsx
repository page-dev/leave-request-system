import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ManagedUser } from '../types';

export function ViewUserDialog({
    user,
    currentUserId,
    activeAdministratorCount,
    onOpenChange,
}: {
    user: ManagedUser | null;
    currentUserId: number;
    activeAdministratorCount: number;
    onOpenChange: (open: boolean) => void;
}) {
    const protectionNotice =
        user?.is_active && user.id === currentUserId
            ? 'The currently logged-in user cannot be deactivated.'
            : user?.is_active &&
                user.role === 'administrator' &&
                activeAdministratorCount <= 1
              ? 'The last active administrator account cannot be deactivated.'
              : null;

    return (
        <Dialog open={user !== null} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524]">
                <DialogHeader>
                    <DialogTitle>User details</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Account information and current access status.
                    </DialogDescription>
                </DialogHeader>
                <dl className="grid gap-4 text-sm">
                    <Detail label="First name" value={user?.first_name} />
                    <Detail label="Last name" value={user?.last_name} />
                    <Detail label="Email" value={user?.email} />
                    <Detail
                        label="Role"
                        value={
                            user?.role === 'administrator'
                                ? 'Administrator'
                                : 'Employee'
                        }
                    />
                    <Detail
                        label="Status"
                        value={user?.is_active ? 'Active' : 'Inactive'}
                    >
                        {protectionNotice && (
                            <p className="rounded-md border border-[#E24B4A] bg-[#FCEBEB] px-3 py-2 text-xs font-medium text-[#791F1F]">
                                {protectionNotice}
                            </p>
                        )}
                    </Detail>
                    <Detail
                        label="Created"
                        value={
                            user
                                ? new Intl.DateTimeFormat(undefined, {
                                      dateStyle: 'medium',
                                  }).format(new Date(user.created_at))
                                : undefined
                        }
                    />
                </dl>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function Detail({
    label,
    value,
    children,
}: {
    label: string;
    value?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="grid gap-1">
            <dt className="text-xs font-medium text-[#78716C]">{label}</dt>
            <dd className="font-medium text-[#292524]">{value ?? '—'}</dd>
            {children}
        </div>
    );
}
