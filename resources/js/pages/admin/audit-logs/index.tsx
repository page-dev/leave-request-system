import { Head, router } from '@inertiajs/react';
import { ClipboardList, Search } from 'lucide-react';
import { useState } from 'react';
import { PaginatedNavigation } from '@/components/paginated-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { alignEndDateWithStartDate } from '@/lib/date-range';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as auditLogsIndex } from '@/routes/admin/audit-logs';
import { AuditLogDetailsDialog } from './components/audit-log-details-dialog';
import { AuditLogsTable } from './components/audit-logs-table';
import type {
    AuditAdministrator,
    AuditLog,
    AuditLogFilters,
    AuditLogPaginator,
} from './types';

const allOptions = 'all';

export default function AuditLogsIndex({
    auditLogs,
    actions,
    administrators,
    filters,
}: {
    auditLogs: AuditLogPaginator;
    actions: string[];
    administrators: AuditAdministrator[];
    filters: AuditLogFilters;
}) {
    const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(
        null,
    );
    const [search, setSearch] = useState(filters.search ?? '');
    const [action, setAction] = useState(filters.action ?? allOptions);
    const [userId, setUserId] = useState(
        filters.user_id === null ? allOptions : String(filters.user_id),
    );
    const [startDate, setStartDate] = useState(filters.start_date ?? '');
    const [endDate, setEndDate] = useState(filters.end_date ?? '');

    const visit = (
        next: Partial<{
            search: string;
            action: string;
            userId: string;
            startDate: string;
            endDate: string;
        }>,
    ) => {
        const nextFilters = {
            search,
            action,
            userId,
            startDate,
            endDate,
            ...next,
        };

        setSearch(nextFilters.search);
        setAction(nextFilters.action);
        setUserId(nextFilters.userId);
        setStartDate(nextFilters.startDate);
        setEndDate(nextFilters.endDate);

        router.get(
            auditLogsIndex.url({
                query: {
                    search: nextFilters.search.trim() || undefined,
                    action:
                        nextFilters.action === allOptions
                            ? undefined
                            : nextFilters.action,
                    user_id:
                        nextFilters.userId === allOptions
                            ? undefined
                            : nextFilters.userId,
                    start_date: nextFilters.startDate || undefined,
                    end_date: nextFilters.endDate || undefined,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const hasFilters =
        search !== '' ||
        action !== allOptions ||
        userId !== allOptions ||
        startDate !== '' ||
        endDate !== '';

    return (
        <>
            <Head title="Audit log" />
            <section
                aria-label="Administrator audit log"
                className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8"
            >
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                                Audit log
                            </h1>
                            <p className="mt-1 text-sm text-[#78716C]">
                                Review consequential administrative actions.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-end gap-3">
                            <form
                                className="grid gap-1.5"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    visit({ search });
                                }}
                            >
                                <label
                                    htmlFor="audit-log-search"
                                    className="text-xs font-medium text-[#78716C]"
                                >
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#78716C]" />
                                    <Input
                                        id="audit-log-search"
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Action, user, or target"
                                        className="w-56 border-[#E7E5E4] bg-white pr-3 pl-9 text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    />
                                </div>
                            </form>

                            <FilterSelect
                                id="audit-action"
                                label="Action"
                                value={action}
                                onValueChange={(value) =>
                                    visit({ action: value })
                                }
                            >
                                <SelectItem value={allOptions}>
                                    All actions
                                </SelectItem>
                                {actions.map((action) => (
                                    <SelectItem key={action} value={action}>
                                        {action
                                            .replaceAll('.', ' · ')
                                            .replaceAll('_', ' ')}
                                    </SelectItem>
                                ))}
                            </FilterSelect>

                            <FilterSelect
                                id="audit-administrator"
                                label="Administrator"
                                value={userId}
                                onValueChange={(value) =>
                                    visit({ userId: value })
                                }
                            >
                                <SelectItem value={allOptions}>
                                    All administrators
                                </SelectItem>
                                {administrators.map((administrator) => (
                                    <SelectItem
                                        key={administrator.id}
                                        value={String(administrator.id)}
                                    >
                                        {administrator.name}
                                    </SelectItem>
                                ))}
                            </FilterSelect>

                            <DateRangeFilter
                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={(value) =>
                                    visit({
                                        startDate: value,
                                        endDate: alignEndDateWithStartDate(
                                            value,
                                            endDate,
                                        ),
                                    })
                                }
                                onEndDateChange={(value) =>
                                    visit({ endDate: value })
                                }
                            />
                            {hasFilters && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                    onClick={() =>
                                        visit({
                                            search: '',
                                            action: allOptions,
                                            userId: allOptions,
                                            startDate: '',
                                            endDate: '',
                                        })
                                    }
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>

                    {auditLogs.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#E7E5E4] bg-white px-6 py-16 text-center shadow-sm">
                            <div className="rounded-full bg-[#F5F5F4] p-3 text-[#57534E]">
                                <ClipboardList className="size-6" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[#1C1917]">
                                    No audit entries found
                                </h2>
                                <p className="mt-1 text-sm text-[#78716C]">
                                    Administrative actions will appear here
                                    after they are completed.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <AuditLogsTable
                                auditLogs={auditLogs.data}
                                onView={setSelectedAuditLog}
                            />
                            <PaginatedNavigation
                                paginator={auditLogs}
                                ariaLabel="Audit log pagination"
                            />
                        </>
                    )}
                </div>
            </section>

            <AuditLogDetailsDialog
                auditLog={selectedAuditLog}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedAuditLog(null);
                    }
                }}
            />
        </>
    );
}

function FilterSelect({
    id,
    label,
    value,
    onValueChange,
    children,
}: {
    id: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
}) {
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
                    htmlFor="audit-start-date"
                    className="text-xs font-medium text-[#78716C]"
                >
                    Start date
                </label>
                <Input
                    id="audit-start-date"
                    type="date"
                    value={startDate}
                    onChange={(event) => onStartDateChange(event.target.value)}
                    className="w-40 border-[#E7E5E4] bg-white text-[#292524] scheme-light shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                />
            </div>
            <div className="grid gap-1">
                <label
                    htmlFor="audit-end-date"
                    className="text-xs font-medium text-[#78716C]"
                >
                    End date
                </label>
                <Input
                    id="audit-end-date"
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
