import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/pages/leave-requests/components/status-badge';
import {
    formatDate,
    formatDateRange,
} from '@/pages/leave-requests/utils/dates';
import type { AdminLeaveRequest } from '../types';

export function ReviewRequestsTable({
    leaveRequests,
    onView,
}: {
    leaveRequests: AdminLeaveRequest[];
    onView: (request: AdminLeaveRequest) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[#E7E5E4] bg-white shadow-sm">
            <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-xs font-semibold tracking-wide text-[#57534E] uppercase">
                    <tr>
                        <th className="px-5 py-3.5">Employee</th>
                        <th className="px-5 py-3.5">Type</th>
                        <th className="px-5 py-3.5">Dates</th>
                        <th className="px-5 py-3.5">Days</th>
                        <th className="px-5 py-3.5">Submitted</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E4]">
                    {leaveRequests.map((request) => (
                        <tr key={request.id} className="text-[#44403C]">
                            <td className="px-5 py-4">
                                <div className="font-medium text-[#1C1917]">
                                    {request.user.name}
                                </div>
                                <div className="mt-0.5 text-xs text-[#78716C]">
                                    {request.user.email}
                                </div>
                            </td>
                            <td className="px-5 py-4 font-medium text-[#1C1917]">
                                {request.leave_type.name}
                            </td>
                            <td className="px-5 py-4">
                                {formatDateRange(request)}
                            </td>
                            <td className="px-5 py-4">{request.days}</td>
                            <td className="px-5 py-4">
                                {formatDate(request.created_at)}
                            </td>
                            <td className="px-5 py-4">
                                <StatusBadge status={request.status} />
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                        onClick={() => onView(request)}
                                    >
                                        <Eye />
                                        View
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
