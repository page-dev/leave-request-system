import { Head, router } from '@inertiajs/react';
import { ClipboardList, Search } from 'lucide-react';
import { useState } from 'react';
import {
    approve,
    reject,
} from '@/actions/App/Http/Controllers/LeaveRequestController';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SummaryCard } from '@/pages/leave-requests/components/summary-card';
import { index as leaveRequestsIndex } from '@/routes/admin/leave-requests';
import { ReviewRequestDialog } from './components/review-request-dialog';
import { ReviewRequestsTable } from './components/review-requests-table';
import type { AdminLeaveRequest, LeaveRequestStatus, LeaveType } from './types';

const allStatuses = 'all';

export default function AdminLeaveRequestsIndex({
    leaveRequests,
    leaveTypes,
    filters,
}: {
    leaveRequests: AdminLeaveRequest[];
    leaveTypes: LeaveType[];
    filters: {
        search: string | null;
        status: string | null;
        leave_type_id: number | null;
    };
}) {
    const [selectedRequest, setSelectedRequest] =
        useState<AdminLeaveRequest | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? allStatuses);
    const [leaveTypeId, setLeaveTypeId] = useState(
        filters.leave_type_id ? String(filters.leave_type_id) : allStatuses,
    );

    const counts = leaveRequests.reduce(
        (currentCounts, request) => ({
            ...currentCounts,
            [request.status]: currentCounts[request.status] + 1,
        }),
        { pending: 0, approved: 0, rejected: 0 } satisfies Record<
            LeaveRequestStatus,
            number
        >,
    );

    const updateFilters = (
        nextStatus: string,
        nextLeaveTypeId: string,
        nextSearch = search,
    ) => {
        setStatus(nextStatus);
        setLeaveTypeId(nextLeaveTypeId);
        setSearch(nextSearch);
        router.get(
            leaveRequestsIndex.url({
                query: {
                    search: nextSearch.trim() || undefined,
                    status: nextStatus === allStatuses ? undefined : nextStatus,
                    leave_type_id:
                        nextLeaveTypeId === allStatuses
                            ? undefined
                            : nextLeaveTypeId,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const review = (
        request: AdminLeaveRequest,
        reviewNote: string,
        action: typeof approve | typeof reject,
    ) => {
        setIsReviewing(true);
        router.post(
            action.url(request),
            { review_note: reviewNote || null },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedRequest(null),
                onFinish: () => setIsReviewing(false),
            },
        );
    };

    return (
        <>
            <Head title="Request review" />
            <section
                aria-label="Leave request review"
                className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8"
            >
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SummaryCard label="Pending" value={counts.pending} />
                        <SummaryCard label="Approved" value={counts.approved} />
                        <SummaryCard label="Rejected" value={counts.rejected} />
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                                Request review
                            </h1>
                            <p className="mt-1 text-sm text-[#78716C]">
                                Review and decide employee leave requests.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-end gap-3">
                            <form
                                className="grid gap-1.5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    updateFilters(status, leaveTypeId, search);
                                }}
                            >
                                <label
                                    htmlFor="request-search"
                                    className="text-xs font-medium text-[#78716C]"
                                >
                                    Search employee
                                </label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#78716C]" />
                                    <Input
                                        id="request-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Name or email"
                                        className="w-52 border-[#E7E5E4] bg-white pr-3 pl-9 text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    />
                                </div>
                            </form>
                            <FilterSelect
                                label="Status"
                                value={status}
                                onValueChange={(nextStatus) =>
                                    updateFilters(nextStatus, leaveTypeId)
                                }
                            >
                                <SelectItem value={allStatuses}>
                                    All statuses
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">
                                    Approved
                                </SelectItem>
                                <SelectItem value="rejected">
                                    Rejected
                                </SelectItem>
                            </FilterSelect>
                            <FilterSelect
                                label="Leave type"
                                value={leaveTypeId}
                                onValueChange={(nextLeaveTypeId) =>
                                    updateFilters(status, nextLeaveTypeId)
                                }
                            >
                                <SelectItem value={allStatuses}>
                                    All leave types
                                </SelectItem>
                                {leaveTypes.map((leaveType) => (
                                    <SelectItem
                                        key={leaveType.id}
                                        value={String(leaveType.id)}
                                    >
                                        {leaveType.name}
                                    </SelectItem>
                                ))}
                            </FilterSelect>
                        </div>
                    </div>

                    {leaveRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E7E5E4] bg-white px-6 py-16 text-center shadow-sm">
                            <div className="rounded-full bg-[#F5F5F4] p-3 text-[#57534E]">
                                <ClipboardList className="size-6" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[#1C1917]">
                                    No leave requests found
                                </h2>
                                <p className="mt-1 text-sm text-[#78716C]">
                                    Try changing the filters or check again when
                                    employees submit requests.
                                </p>
                            </div>
                            {(status !== allStatuses ||
                                leaveTypeId !== allStatuses ||
                                search !== '') && (
                                <Button
                                    variant="outline"
                                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                    onClick={() =>
                                        updateFilters(
                                            allStatuses,
                                            allStatuses,
                                            '',
                                        )
                                    }
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <ReviewRequestsTable
                            leaveRequests={leaveRequests}
                            onView={setSelectedRequest}
                        />
                    )}
                </div>
            </section>

            <ReviewRequestDialog
                key={selectedRequest?.id ?? 'empty'}
                request={selectedRequest}
                isReviewing={isReviewing}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedRequest(null);
                    }
                }}
                onApprove={(request, reviewNote) =>
                    review(request, reviewNote, approve)
                }
                onReject={(request, reviewNote) =>
                    review(request, reviewNote, reject)
                }
            />
        </>
    );
}

function FilterSelect({
    label,
    value,
    onValueChange,
    children,
}: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}) {
    const id = label.toLowerCase().replace(' ', '-');

    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-xs font-medium text-[#78716C]">
                {label}
            </label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    id={id}
                    className="w-44 border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-[#E7E5E4] bg-white text-[#292524]">
                    {children}
                </SelectContent>
            </Select>
        </div>
    );
}
