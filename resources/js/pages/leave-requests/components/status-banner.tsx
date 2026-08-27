import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LeaveRequest } from '../types';
import { formatDateRange, formatRelativeTime } from '../utils/dates';
import { leaveRequestStatusStyles } from '../utils/status';

export function StatusBanner({
    request,
    additionalPendingCount,
    onView,
}: {
    request: LeaveRequest;
    additionalPendingCount: number;
    onView: () => void;
}) {
    const { Icon } = leaveRequestStatusStyles[request.status];
    const isPending = request.status === 'pending';

    return (
        <div
            className={`flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${leaveRequestStatusStyles[request.status].banner}`}
        >
            <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0" />
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="font-semibold">
                            {request.leave_type.name} ·{' '}
                            {formatDateRange(request)}
                        </p>
                        {additionalPendingCount > 0 && (
                            <span className="text-sm font-medium">
                                +{additionalPendingCount} more pending
                            </span>
                        )}
                    </div>
                    <p className="text-sm capitalize">
                        {request.status} · {isPending ? 'submitted' : 'updated'}{' '}
                        {formatRelativeTime(
                            isPending ? request.created_at : request.updated_at,
                        )}
                    </p>
                </div>
            </div>
            <Button
                variant="outline"
                className="w-full border-current bg-white/70 text-current hover:bg-white hover:text-current sm:w-auto"
                onClick={onView}
            >
                <Eye />
                View
            </Button>
        </div>
    );
}
