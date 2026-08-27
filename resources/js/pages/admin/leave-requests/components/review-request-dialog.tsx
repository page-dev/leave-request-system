import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/pages/leave-requests/components/status-badge';
import {
    formatDate,
    formatDateRange,
} from '@/pages/leave-requests/utils/dates';
import type { AdminLeaveRequest } from '../types';

type ReviewRequestDialogProps = {
    request: AdminLeaveRequest | null;
    isReviewing: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onApprove: (request: AdminLeaveRequest, reviewNote: string) => void;
    onReject: (request: AdminLeaveRequest, reviewNote: string) => void;
};

type Decision = 'approved' | 'rejected';

export function ReviewRequestDialog({
    request,
    isReviewing,
    onOpenChange,
    onApprove,
    onReject,
}: ReviewRequestDialogProps) {
    const [reviewNote, setReviewNote] = useState('');
    const [pendingDecision, setPendingDecision] = useState<Decision | null>(
        null,
    );

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
                                Review this employee leave request.
                            </DialogDescription>
                        </DialogHeader>

                        <dl className="grid gap-4 text-sm">
                            <Detail
                                label="Employee"
                                value={`${request.user.name}\n${request.user.email}`}
                            />
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
                                value={`${request.days} day${request.days === 1 ? '' : 's'}`}
                            />
                            <Detail label="Reason" value={request.reason} />
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
                                            'Not available'
                                        }
                                    />
                                    <Detail
                                        label="Decision date"
                                        value={
                                            request.reviewed_at
                                                ? formatDate(
                                                      request.reviewed_at,
                                                  )
                                                : 'Not available'
                                        }
                                    />
                                    {request.review_note && (
                                        <Detail
                                            label="Review note"
                                            value={request.review_note}
                                        />
                                    )}
                                </>
                            )}
                        </dl>

                        {request.status === 'pending' && (
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label
                                        htmlFor="review_note"
                                        className="text-sm font-medium text-[#292524]"
                                    >
                                        Review note{' '}
                                        <span className="text-[#78716C]">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="review_note"
                                        value={reviewNote}
                                        onChange={(event) =>
                                            setReviewNote(event.target.value)
                                        }
                                        rows={3}
                                        className="w-full resize-y rounded-md border border-[#E7E5E4] bg-white px-3 py-2 text-sm text-[#292524] outline-none focus-visible:border-[#A8A29E] focus-visible:ring-[3px] focus-visible:ring-[#D6D3D1]/50"
                                        placeholder="Add an optional note for the employee"
                                    />
                                </div>
                                {pendingDecision && (
                                    <div
                                        role="alert"
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E7E5E4] bg-[#FAFAF9] p-3"
                                    >
                                        <p className="text-sm text-[#44403C]">
                                            Confirm that you want to{' '}
                                            <span className="font-semibold">
                                                {pendingDecision}
                                            </span>{' '}
                                            this request. This decision is
                                            final.
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                                onClick={() =>
                                                    setPendingDecision(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className={
                                                    pendingDecision ===
                                                    'approved'
                                                        ? 'bg-[#27500A] text-[#FFFFFF] hover:bg-[#1E3D08]'
                                                        : 'border border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]'
                                                }
                                                disabled={isReviewing}
                                                onClick={() => {
                                                    if (
                                                        pendingDecision ===
                                                        'approved'
                                                    ) {
                                                        onApprove(
                                                            request,
                                                            reviewNote,
                                                        );
                                                    } else {
                                                        onReject(
                                                            request,
                                                            reviewNote,
                                                        );
                                                    }
                                                }}
                                            >
                                                Confirm {pendingDecision}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <DialogFooter>
                            {request.status === 'pending' && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]"
                                        disabled={isReviewing}
                                        onClick={() =>
                                            setPendingDecision('rejected')
                                        }
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        type="button"
                                        className="bg-[#27500A] text-[#FFFFFF] hover:bg-[#1E3D08]"
                                        disabled={isReviewing}
                                        onClick={() =>
                                            setPendingDecision('approved')
                                        }
                                    >
                                        Approve
                                    </Button>
                                </>
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
