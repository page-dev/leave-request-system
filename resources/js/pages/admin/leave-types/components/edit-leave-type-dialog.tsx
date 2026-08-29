import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { update } from '@/actions/App/Http/Controllers/LeaveTypeController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LeaveType, LeaveTypeFormData } from '../types';
import { LeaveTypeForm } from './leave-type-form';

export function EditLeaveTypeDialog({
    leaveType,
    onOpenChange,
}: {
    leaveType: LeaveType | null;
    onOpenChange: (open: boolean) => void;
}) {
    const { clearErrors, data, errors, processing, put, reset, setData } =
        useForm<LeaveTypeFormData>({
            name: '',
            description: '',
            day_limit: '',
        });

    useEffect(() => {
        if (!leaveType) {
            return;
        }

        setData({
            name: leaveType.name,
            description: leaveType.description,
            day_limit: leaveType.day_limit?.toString() ?? '',
        });
        clearErrors();
    }, [clearErrors, leaveType, setData]);

    const close = () => {
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={leaveType !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    close();
                }
            }}
        >
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524] sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit leave type</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Update the information for {leaveType?.name}.
                    </DialogDescription>
                </DialogHeader>
                <LeaveTypeForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Save changes"
                    onDataChange={setData}
                    onCancel={close}
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!leaveType) {
                            return;
                        }

                        put(update.url(leaveType), {
                            preserveScroll: true,
                            onSuccess: close,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
