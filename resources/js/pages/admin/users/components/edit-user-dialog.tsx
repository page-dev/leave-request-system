import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { update } from '@/actions/App/Http/Controllers/UserController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ManagedUser, UserFormData } from '../types';
import { UserForm } from './user-form';

const initialData: UserFormData = {
    first_name: '',
    last_name: '',
    email: '',
    role: 'employee',
    password: '',
    password_confirmation: '',
};

export function EditUserDialog({
    user,
    onOpenChange,
}: {
    user: ManagedUser | null;
    onOpenChange: (open: boolean) => void;
}) {
    const { clearErrors, data, errors, processing, put, reset, setData } =
        useForm<UserFormData>(initialData);

    useEffect(() => {
        if (!user) {
            return;
        }

        setData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        clearErrors();
    }, [clearErrors, setData, user]);

    const close = () => {
        reset();
        clearErrors();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={user !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    close();
                }
            }}
        >
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524] sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit user</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Update {user?.first_name} {user?.last_name}'s account
                        details.
                    </DialogDescription>
                </DialogHeader>
                <UserForm
                    data={data}
                    errors={errors}
                    processing={processing}
                    submitLabel="Save changes"
                    passwordRequired={false}
                    onDataChange={setData}
                    onCancel={close}
                    onSubmit={(event) => {
                        event.preventDefault();

                        if (!user) {
                            return;
                        }

                        put(update.url(user), {
                            preserveScroll: true,
                            onSuccess: close,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
