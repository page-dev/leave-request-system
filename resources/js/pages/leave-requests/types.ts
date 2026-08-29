export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected';

export type LeaveType = {
    id: number;
    name: string;
    day_limit?: number | null;
    used_days?: number;
};

export type LeaveRequest = {
    id: number;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: LeaveRequestStatus;
    created_at: string;
    updated_at: string;
    reviewed_at: string | null;
    leave_type: LeaveType;
    reviewer?: {
        id: number;
        name: string;
    } | null;
};
