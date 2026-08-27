import { Badge } from '@/components/ui/badge';
import type { LeaveRequestStatus } from '../types';
import { leaveRequestStatusStyles } from '../utils/status';

export function StatusBadge({ status }: { status: LeaveRequestStatus }) {
    return (
        <Badge
            variant="outline"
            className={`rounded-full px-2.5 py-1 font-semibold capitalize ${leaveRequestStatusStyles[status].badge}`}
        >
            {status}
        </Badge>
    );
}
