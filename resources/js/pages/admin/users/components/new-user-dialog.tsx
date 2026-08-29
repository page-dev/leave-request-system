import { useForm } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/UserController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { UserFormData } from '../types';
import { UserForm } from './user-form';

const initialData: UserFormData = {
    first_name: '',
    last_name: '',
    email: '',
    role: 'employee',
    password: '',
    password_confirmation: '',
};

export function NewUserDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const { clearErrors, data, errors, post, processing, reset, setData } =
        useForm<UserFormData>(initialData);

    const close = () => {
        reset();
        clearErrors();
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
                    <DialogTitle>New user</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Create an employee or administrator account.
                    </DialogDescription>
                </DialogHeader>
                <UserForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Create user"
                    passwordRequired={true}
                    onDataChange={setData}
                    onCancel={close}
                    onSubmit={(event) => {
                        event.preventDefault();
                        post(store.url(), {
                            preserveScroll: true,
                            onSuccess: close,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
