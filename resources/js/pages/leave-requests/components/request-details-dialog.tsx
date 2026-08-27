import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LeaveRequest } from '../types';
import {
    formatDate,
    formatDateRange,
    getLeaveRequestDays,
} from '../utils/dates';
import { StatusBadge } from './status-badge';

export function RequestDetailsDialog({
    request,
    onOpenChange,
    onDelete,
}: {
    request: LeaveRequest | null;
    onOpenChange: (open: boolean) => void;
    onDelete: (request: LeaveRequest) => void;
}) {
    return (
        <Dialog open={request !== null} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white text-[#292524]">
                {request && (
                    <>
                        <DialogHeader>
                            <div className="flex flex-wrap items-center gap-2 pr-6">
                                <DialogTitle>Leave request details</DialogTitle>
                                <StatusBadge status={request.status} />
                            </div>
                            <DialogDescription className="text-[#78716C]">
                                Details of your submitted leave request.
                            </DialogDescription>
                        </DialogHeader>
                        <dl className="grid gap-4 text-sm">
                            <Detail
                                label="Leave type"
                                value={request.leave_type.name}
                            />
                            <Detail
                                label="Dates"
                                value={formatDateRange(request)}
                            />
                            <Detail
                                label="Total days"
                                value={`${getLeaveRequestDays(request.start_date, request.end_date)} day${getLeaveRequestDays(request.start_date, request.end_date) === 1 ? '' : 's'}`}
                            />
                            <Detail
                                label="Description"
                                value={request.reason}
                            />
                            <Detail
                                label="Submitted"
                                value={formatDate(request.created_at)}
                            />
                            {request.status !== 'pending' && (
                                <>
                                    <Detail
                                        label="Approver"
                                        value={
                                            request.reviewer?.name ??
                                            'To be available'
                                        }
                                    />
                                    <Detail
                                        label="Decision date"
                                        value={
                                            request.reviewed_at
                                                ? formatDate(
                                                      request.reviewed_at,
                                                  )
                                                : 'To be available'
                                        }
                                    />
                                </>
                            )}
                        </dl>
                        <DialogFooter>
                            {request.status === 'pending' && (
                                <Button
                                    variant="outline"
                                    className="border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]"
                                    onClick={() => onDelete(request)}
                                >
                                    <Trash2 />
                                    Delete request
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1 rounded-lg bg-[#FAFAF9] p-3">
            <dt className="text-xs font-semibold tracking-wide text-[#78716C] uppercase">
                {label}
            </dt>
            <dd className="font-medium whitespace-pre-wrap text-[#292524]">
                {value}
            </dd>
        </div>
    );
}
