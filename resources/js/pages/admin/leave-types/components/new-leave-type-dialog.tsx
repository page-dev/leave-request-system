import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/LeaveTypeController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LeaveTypeFormData } from '../types';
import { LeaveTypeForm } from './leave-type-form';

export function NewLeaveTypeDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm<LeaveTypeFormData>({
        name: '',
        description: '',
        day_limit: '',
    });

    const close = () => {
        form.reset();
        form.clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    close();
                }
            }}
        >
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524] sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>New leave type</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Add a leave type that employees can select in a leave
                        request.
                    </DialogDescription>
                </DialogHeader>
                <LeaveTypeForm
                    data={form.data}
                    errors={form.errors}
                    processing={form.processing}
                    submitLabel="Create leave type"
                    onDataChange={form.setData}
                    onCancel={close}
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.post(store.url(), {
                            preserveScroll: true,
                            onSuccess: close,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
