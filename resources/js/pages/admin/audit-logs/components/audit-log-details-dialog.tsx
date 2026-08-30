import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { AuditLog } from '../types';

export function AuditLogDetailsDialog({
    auditLog,
    onOpenChange,
}: {
    auditLog: AuditLog | null;
    onOpenChange: (open: boolean) => void;
}) {
    const changes = Object.keys({
        ...(auditLog?.old_values ?? {}),
        ...(auditLog?.new_values ?? {}),
    });

    return (
        <Dialog
            open={auditLog !== null}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524] sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Audit log details</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        {auditLog?.description ?? 'Administrative activity details.'}
                    </DialogDescription>
                </DialogHeader>

                {auditLog !== null && (
                    <div className="grid gap-5 text-sm">
                        <dl className="grid gap-3 rounded-lg bg-[#FAFAF9] p-4 sm:grid-cols-2">
                            <Detail label="Action" value={formatAction(auditLog.action)} />
                            <Detail
                                label="Target"
                                value={formatSubject(auditLog)}
                            />
                            <Detail
                                label="Administrator"
                                value={auditLog.user?.name ?? 'System'}
                            />
                            <Detail
                                label="Date and time"
                                value={new Intl.DateTimeFormat(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short',
                                }).format(new Date(auditLog.created_at))}
                            />
                        </dl>

                        {changes.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-[#1C1917]">
                                    Changes
                                </h3>
                                <div className="mt-3 divide-y divide-[#E7E5E4] rounded-lg border border-[#E7E5E4]">
                                    {changes.map((key) => (
                                        <div
                                            key={key}
                                            className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr_1fr] sm:items-center sm:gap-3"
                                        >
                                            <span className="font-medium text-[#57534E]">
                                                {formatField(key)}
                                            </span>
                                            <span className="text-[#78716C]">
                                                {formatValue(
                                                    auditLog.old_values?.[key],
                                                )}
                                            </span>
                                            <span className="font-medium text-[#292524]">
                                                {formatValue(
                                                    auditLog.new_values?.[key],
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs font-medium text-[#78716C]">{label}</dt>
            <dd className="mt-1 font-medium text-[#292524]">{value}</dd>
        </div>
    );
}

export function formatAction(action: string): string {
    return action
        .split('.')
        .map((part) => part.replaceAll('_', ' '))
        .join(' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatSubject(auditLog: AuditLog): string {
    if (auditLog.subject_type === null || auditLog.subject_id === null) {
        return '—';
    }

    return `${auditLog.subject_type} #${auditLog.subject_id}`;
}

function formatField(field: string): string {
    return field
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatValue(value: unknown): string {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (typeof value === 'string' && value.includes('T')) {
        const parsedDate = new Date(value);

        if (!Number.isNaN(parsedDate.getTime())) {
            return new Intl.DateTimeFormat(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(parsedDate);
        }
    }

    return String(value);
}
