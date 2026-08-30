import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuditLog } from '../types';
import {
    formatAction,
    formatSubject,
} from './audit-log-details-dialog';

export function AuditLogsTable({
    auditLogs,
    onView,
}: {
    auditLogs: AuditLog[];
    onView: (auditLog: AuditLog) => void;
}) {
    return (
        <div className="overflow-x-auto rounded-xl border border-[#E7E5E4] bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-[#E7E5E4] bg-[#FAFAF9] text-xs font-semibold tracking-wide text-[#57534E] uppercase">
                    <tr>
                        <th className="px-5 py-3.5">Date and time</th>
                        <th className="px-5 py-3.5">Administrator</th>
                        <th className="px-5 py-3.5">Action</th>
                        <th className="px-5 py-3.5">Target</th>
                        <th className="px-5 py-3.5">Description</th>
                        <th className="px-5 py-3.5 text-right">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E4]">
                    {auditLogs.map((auditLog) => (
                        <tr key={auditLog.id} className="text-[#44403C]">
                            <td className="whitespace-nowrap px-5 py-4">
                                {new Intl.DateTimeFormat(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                }).format(new Date(auditLog.created_at))}
                            </td>
                            <td className="px-5 py-4">
                                <div className="font-medium text-[#1C1917]">
                                    {auditLog.user?.name ?? 'System'}
                                </div>
                                {auditLog.user !== null && (
                                    <div className="mt-0.5 text-xs text-[#78716C]">
                                        {auditLog.user.email}
                                    </div>
                                )}
                            </td>
                            <td className="px-5 py-4 font-medium text-[#292524]">
                                {formatAction(auditLog.action)}
                            </td>
                            <td className="px-5 py-4">
                                {formatSubject(auditLog)}
                            </td>
                            <td className="max-w-sm px-5 py-4 text-[#57534E]">
                                <span className="line-clamp-2">
                                    {auditLog.description ?? '—'}
                                </span>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                        onClick={() => onView(auditLog)}
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
