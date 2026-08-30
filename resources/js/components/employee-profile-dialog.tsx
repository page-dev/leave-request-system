import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';

export function EmployeeProfileDialog({
    user,
    open,
    onOpenChange,
}: {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-[#E7E5E4] bg-white text-[#292524] sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>My profile</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        View your account information and change your password.
                    </DialogDescription>
                </DialogHeader>

                <dl className="grid gap-3 rounded-lg bg-[#FAF9F6] p-4 text-sm">
                    <ProfileDetail label="Name" value={user.name} />
                    <ProfileDetail label="Email" value={user.email} />
                </dl>

                <Form
                    {...SecurityController.update.form()}
                    options={{ preserveScroll: true }}
                    resetOnError={[
                        'current_password',
                        'password',
                        'password_confirmation',
                    ]}
                    resetOnSuccess
                    onSuccess={() => onOpenChange(false)}
                    onError={(errors) => {
                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        } else if (errors.password) {
                            passwordInput.current?.focus();
                        }
                    }}
                    className="grid gap-4"
                >
                    {({ errors, processing }) => (
                        <>
                            <div>
                                <h2 className="font-semibold text-[#1C1917]">
                                    Change password
                                </h2>
                                <p className="mt-1 text-sm text-[#78716C]">
                                    Use a strong password that you do not use
                                    elsewhere.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="profile-current-password">
                                    Current password
                                    <span className="text-[#E24B4A]"> *</span>
                                </Label>
                                <PasswordInput
                                    id="profile-current-password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    autoComplete="current-password"
                                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    required
                                />
                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="profile-password">
                                    New password
                                    <span className="text-[#E24B4A]"> *</span>
                                </Label>
                                <PasswordInput
                                    id="profile-password"
                                    ref={passwordInput}
                                    name="password"
                                    autoComplete="new-password"
                                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="profile-password-confirmation">
                                    Confirm new password
                                    <span className="text-[#E24B4A]"> *</span>
                                </Label>
                                <PasswordInput
                                    id="profile-password-confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className="bg-black text-white hover:bg-[#1C1917]"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Updating...'
                                        : 'Update password'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ProfileDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1">
            <dt className="text-xs font-medium text-[#78716C]">{label}</dt>
            <dd className="font-medium text-[#292524]">{value}</dd>
        </div>
    );
}
