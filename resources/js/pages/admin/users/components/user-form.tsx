import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { UserFormData } from '../types';

export function UserForm({
    data,
    errors,
    processing,
    submitLabel,
    passwordRequired,
    onDataChange,
    onCancel,
    onSubmit,
}: {
    data: UserFormData;
    errors: Partial<Record<keyof UserFormData, string>>;
    processing: boolean;
    submitLabel: string;
    passwordRequired: boolean;
    onDataChange: <K extends keyof UserFormData>(
        field: K,
        value: UserFormData[K],
    ) => void;
    onCancel: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form className="grid gap-5" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="user-first-name" className="text-[#292524]">
                        First name <span className="text-[#E24B4A]">*</span>
                    </Label>
                    <Input
                        id="user-first-name"
                        value={data.first_name}
                        onChange={(event) =>
                            onDataChange('first_name', event.target.value)
                        }
                        className="border-[#E7E5E4] bg-white text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                        placeholder="First name"
                        required
                        autoComplete="given-name"
                        autoFocus
                    />
                    <InputError message={errors.first_name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="user-last-name" className="text-[#292524]">
                        Last name <span className="text-[#E24B4A]">*</span>
                    </Label>
                    <Input
                        id="user-last-name"
                        value={data.last_name}
                        onChange={(event) =>
                            onDataChange('last_name', event.target.value)
                        }
                        className="border-[#E7E5E4] bg-white text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                        placeholder="Last name"
                        required
                        autoComplete="family-name"
                    />
                    <InputError message={errors.last_name} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-email" className="text-[#292524]">
                    Email address <span className="text-[#E24B4A]">*</span>
                </Label>
                <Input
                    id="user-email"
                    type="email"
                    value={data.email}
                    onChange={(event) =>
                        onDataChange('email', event.target.value)
                    }
                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    placeholder="name@example.com"
                    required
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-role" className="text-[#292524]">
                    Role <span className="text-[#E24B4A]">*</span>
                </Label>
                <Select
                    value={data.role}
                    onValueChange={(role: UserFormData['role']) =>
                        onDataChange('role', role)
                    }
                >
                    <SelectTrigger
                        id="user-role"
                        className="w-full border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#E7E5E4] bg-white text-[#292524]">
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="administrator">
                            Administrator
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.role} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-password" className="text-[#292524]">
                    Password{' '}
                    {passwordRequired && (
                        <span className="text-[#E24B4A]">*</span>
                    )}{' '}
                    {passwordRequired ? '' : '(leave blank to keep)'}
                </Label>
                <Input
                    id="user-password"
                    type="password"
                    value={data.password}
                    onChange={(event) =>
                        onDataChange('password', event.target.value)
                    }
                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    required={passwordRequired}
                    autoComplete="new-password"
                />
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
                <Label
                    htmlFor="user-password-confirmation"
                    className="text-[#292524]"
                >
                    Confirm password{' '}
                    {passwordRequired && (
                        <span className="text-[#E24B4A]">*</span>
                    )}
                </Label>
                <Input
                    id="user-password-confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(event) =>
                        onDataChange(
                            'password_confirmation',
                            event.target.value,
                        )
                    }
                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    required={passwordRequired}
                    autoComplete="new-password"
                />
                <InputError message={errors.password_confirmation} />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-black text-white hover:bg-[#292524]"
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
