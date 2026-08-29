export type LeaveType = {
    id: number;
    name: string;
    description: string;
    day_limit: number | null;
    leave_requests_count?: number;
};

export type LeaveTypeFormData = {
    name: string;
    description: string;
    day_limit: string;
};
