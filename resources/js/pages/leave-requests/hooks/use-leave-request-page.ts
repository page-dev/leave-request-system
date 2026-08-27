import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/LeaveRequestController';
import type { LeaveRequest } from '../types';
import { getLeaveRequestDays } from '../utils/dates';

export function useLeaveRequestPage(leaveRequests: LeaveRequest[]) {
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
        null,
    );
    const [requestToDelete, setRequestToDelete] = useState<LeaveRequest | null>(
        null,
    );
    const [leaveTypeId, setLeaveTypeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const counts = useMemo(
        () => ({
            pending: leaveRequests.filter(({ status }) => status === 'pending')
                .length,
            approved: leaveRequests.filter(
                ({ status }) => status === 'approved',
            ).length,
            rejected: leaveRequests.filter(
                ({ status }) => status === 'rejected',
            ).length,
        }),
        [leaveRequests],
    );

    const featuredRequest = useMemo(() => {
        const pendingRequests = leaveRequests
            .filter(({ status }) => status === 'pending')
            .sort(
                (first, second) =>
                    new Date(second.created_at).getTime() -
                    new Date(first.created_at).getTime(),
            );

        return (
            pendingRequests[0] ??
            [...leaveRequests].sort(
                (first, second) =>
                    new Date(second.updated_at).getTime() -
                    new Date(first.updated_at).getTime(),
            )[0]
        );
    }, [leaveRequests]);

    function closeNewRequestDialog(): void {
        setIsNewRequestOpen(false);
        setLeaveTypeId('');
        setStartDate('');
        setEndDate('');
    }

    function openDeleteDialog(request: LeaveRequest): void {
        setSelectedRequest(null);
        setRequestToDelete(request);
    }

    function deleteRequest(): void {
        if (!requestToDelete) {
            return;
        }

        router.delete(destroy.url(requestToDelete.id), {
            preserveScroll: true,
            onSuccess: () => setRequestToDelete(null),
        });
    }

    return {
        counts,
        featuredRequest,
        additionalPendingCount: Math.max(0, counts.pending - 1),
        dayCount: getLeaveRequestDays(startDate, endDate),
        isNewRequestOpen,
        selectedRequest,
        requestToDelete,
        leaveTypeId,
        startDate,
        endDate,
        setIsNewRequestOpen,
        setSelectedRequest,
        setRequestToDelete,
        setLeaveTypeId,
        setStartDate,
        setEndDate,
        closeNewRequestDialog,
        openDeleteDialog,
        deleteRequest,
    };
}
