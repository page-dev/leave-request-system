import type {
    LeaveRequest,
    LeaveRequestStatus,
    LeaveType,
} from '@/pages/leave-requests/types';

export type AdminLeaveRequest = LeaveRequest & {
    review_note: string | null;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export type { LeaveRequestStatus, LeaveType };
