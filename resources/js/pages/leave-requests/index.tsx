import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeleteRequestDialog } from './components/delete-request-dialog';
import { EmptyState } from './components/empty-state';
import { NewRequestDialog } from './components/new-request-dialog';
import { RequestDetailsDialog } from './components/request-details-dialog';
import { RequestsTable } from './components/requests-table';
import { StatusBanner } from './components/status-banner';
import { SummaryCard } from './components/summary-card';
import { useLeaveRequestPage } from './hooks/use-leave-request-page';
import type { LeaveRequest, LeaveType } from './types';

export default function LeaveRequestsIndex({
    leaveRequests,
    leaveTypes,
}: {
    leaveRequests: LeaveRequest[];
    leaveTypes: LeaveType[];
}) {
    const page = useLeaveRequestPage(leaveRequests);

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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <SummaryCard
                            label="Pending"
                            value={page.counts.pending}
                        />
                        <SummaryCard
                            label="Approved"
                            value={page.counts.approved}
                        />
                        <SummaryCard
                            label="Rejected"
                            value={page.counts.rejected}
                        />
                    </div>

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

                    {leaveRequests.length === 0 ? (
                        <EmptyState
                            onNewRequest={() => page.setIsNewRequestOpen(true)}
                        />
                    ) : (
                        <RequestsTable
                            leaveRequests={leaveRequests}
                            onView={page.setSelectedRequest}
                            onDelete={page.openDeleteDialog}
                        />
                    )}
                </div>
            </section>

            <NewRequestDialog
                leaveTypes={leaveTypes}
                isOpen={page.isNewRequestOpen}
                leaveTypeId={page.leaveTypeId}
                startDate={page.startDate}
                endDate={page.endDate}
                dayCount={page.dayCount}
                onOpenChange={page.setIsNewRequestOpen}
                onLeaveTypeChange={page.setLeaveTypeId}
                onStartDateChange={page.setStartDate}
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
            />
        </>
    );
}
