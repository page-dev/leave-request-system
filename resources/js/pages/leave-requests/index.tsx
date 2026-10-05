import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { PaginatedNavigation } from '@/components/paginated-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { alignEndDateWithStartDate } from '@/lib/date-range';
import { index as leaveRequestsIndex } from '@/routes/leave-requests';
import type { Paginator } from '@/types/pagination';
import { DeleteRequestDialog } from './components/delete-request-dialog';
import { EmptyState } from './components/empty-state';
import { NewRequestDialog } from './components/new-request-dialog';
import { RequestDetailsDialog } from './components/request-details-dialog';
import { RequestsTable } from './components/requests-table';
import { StatusBanner } from './components/status-banner';
import { useLeaveRequestPage } from './hooks/use-leave-request-page';
import type { LeaveRequest, LeaveType } from './types';

const allStatuses = 'all';

export default function LeaveRequestsIndex({
    leaveRequests,
    leaveTypes,
    countedWeekdays,
    enforceLeaveLimits,
    filters,
}: {
    leaveRequests: Paginator<LeaveRequest>;
    leaveTypes: LeaveType[];
    countedWeekdays: number[];
    enforceLeaveLimits: boolean;
    filters: {
        start_date: string | null;
        end_date: string | null;
        status: string | null;
        leave_type_id: number | null;
    };
}) {
    const requests = leaveRequests.data;
    const page = useLeaveRequestPage(requests, countedWeekdays);
    const status = filters.status ?? allStatuses;
    const leaveTypeId = filters.leave_type_id
        ? String(filters.leave_type_id)
        : allStatuses;
    const startDate = filters.start_date ?? '';
    const endDate = filters.end_date ?? '';

    const updateFilters = (
        nextStatus: string,
        nextLeaveTypeId: string,
        nextStartDate = startDate,
        nextEndDate = endDate,
    ) => {
        router.get(
            leaveRequestsIndex.url({
                query: {
                    start_date: nextStartDate || undefined,
                    end_date: nextEndDate || undefined,
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

    const hasActiveFilters =
        status !== allStatuses ||
        leaveTypeId !== allStatuses ||
        startDate !== '' ||
        endDate !== '';

    return (
        <>
            <Head title="Leave Requests" />
            <section
                aria-label="Leave requests"
                className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] py-6 sm:py-8"
            >
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    {page.featuredRequest && (
                        <StatusBanner
                            request={page.featuredRequest}
                            additionalPendingCount={page.additionalPendingCount}
                            onView={() =>
                                page.setSelectedRequest(page.featuredRequest)
                            }
                        />
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                                My requests
                            </h1>
                            <p className="mt-1 text-sm text-[#78716C]">
                                Review and manage your submitted leave requests.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                            onClick={() => page.setIsNewRequestOpen(true)}
                        >
                            <Plus />
                            New request
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                        <DateRangeFilter
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={(nextStartDate) =>
                                updateFilters(
                                    status,
                                    leaveTypeId,
                                    nextStartDate,
                                    alignEndDateWithStartDate(
                                        nextStartDate,
                                        endDate,
                                    ),
                                )
                            }
                            onEndDateChange={(nextEndDate) =>
                                updateFilters(
                                    status,
                                    leaveTypeId,
                                    startDate,
                                    nextEndDate,
                                )
                            }
                        />
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
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
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
                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="outline"
                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                onClick={() =>
                                    updateFilters(
                                        allStatuses,
                                        allStatuses,
                                        '',
                                        '',
                                    )
                                }
                            >
                                Clear filters
                            </Button>
                        )}
                    </div>

                    {requests.length === 0 ? (
                        <EmptyState
                            onNewRequest={() => page.setIsNewRequestOpen(true)}
                            hasFilters={hasActiveFilters}
                        />
                    ) : (
                        <>
                            <RequestsTable
                                leaveRequests={requests}
                                onView={page.setSelectedRequest}
                                onDelete={page.openDeleteDialog}
                            />
                            <PaginatedNavigation
                                paginator={leaveRequests}
                                ariaLabel="Leave request pagination"
                            />
                        </>
                    )}
                </div>
            </section>

            <NewRequestDialog
                leaveTypes={leaveTypes}
                enforceLeaveLimits={enforceLeaveLimits}
                isOpen={page.isNewRequestOpen}
                leaveTypeId={page.leaveTypeId}
                startDate={page.startDate}
                endDate={page.endDate}
                dayCount={page.dayCount}
                onOpenChange={page.setIsNewRequestOpen}
                onLeaveTypeChange={page.setLeaveTypeId}
                onStartDateChange={page.updateStartDate}
                onEndDateChange={page.setEndDate}
                onSuccess={page.closeNewRequestDialog}
            />
            <RequestDetailsDialog
                request={page.selectedRequest}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        page.setSelectedRequest(null);
                    }
                }}
                onDelete={page.openDeleteDialog}
            />
            <DeleteRequestDialog
                request={page.requestToDelete}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        page.setRequestToDelete(null);
                    }
                }}
                onConfirm={page.deleteRequest}
                isDeleting={page.isDeleting}
            />
        </>
    );
}

function DateRangeFilter({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: {
    startDate: string;
    endDate: string;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
}) {
    return (
        <fieldset className="flex gap-2">
            <div className="grid gap-1">
                <label
                    htmlFor="filter-start-date"
                    className="text-xs font-medium text-[#78716C]"
                >
                    Start date
                </label>
                <Input
                    id="filter-start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => onStartDateChange(event.target.value)}
                    className="w-40 border-[#E7E5E4] bg-white text-[#292524] scheme-light shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                />
            </div>
            <div className="grid gap-1">
                <label
                    htmlFor="filter-end-date"
                    className="text-xs font-medium text-[#78716C]"
                >
                    End date
                </label>
                <Input
                    id="filter-end-date"
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(event) => onEndDateChange(event.target.value)}
                    className="w-40 border-[#E7E5E4] bg-white text-[#292524] scheme-light shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                />
            </div>
        </fieldset>
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
