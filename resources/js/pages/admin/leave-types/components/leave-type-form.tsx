import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LeaveTypeFormData } from '../types';

export function LeaveTypeForm({
    data,
    errors,
    processing,
    submitLabel,
    onDataChange,
    onCancel,
    onSubmit,
}: {
    data: LeaveTypeFormData;
    errors: Partial<Record<keyof LeaveTypeFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onDataChange: (field: keyof LeaveTypeFormData, value: string) => void;
    onCancel?: () => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form className="grid gap-6" onSubmit={onSubmit}>
            <div className="grid gap-2">
                <Label htmlFor="name" className="text-[#292524]">
                    Name <span className="text-[#E24B4A]">*</span>
                </Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) =>
                        onDataChange('name', event.target.value)
                    }
                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    placeholder="e.g. Vacation leave"
                    required
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description" className="text-[#292524]">
                    Description <span className="text-[#E24B4A]">*</span>
                </Label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(event) =>
                        onDataChange('description', event.target.value)
                    }
                    className="min-h-28 w-full rounded-md border border-[#E7E5E4] bg-white px-3 py-2 text-sm text-[#292524] shadow-none outline-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[3px] focus-visible:ring-[#D6D3D1]/50"
                    placeholder="Describe when employees should use this leave type."
                    required
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="day_limit" className="text-[#292524]">
                    Day limit{' '}
                    <span className="font-normal text-[#78716C]">
                        (optional)
                    </span>
                </Label>
                <Input
                    id="day_limit"
                    type="number"
                    min="1"
                    value={data.day_limit}
                    onChange={(event) =>
                        onDataChange('day_limit', event.target.value)
                    }
                    className="border-[#E7E5E4] bg-white text-[#292524] shadow-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                    placeholder="e.g. 10"
                />
                <p className="text-sm text-[#78716C]">
                    Leave requests are not limited by this value yet.
                </p>
                <InputError message={errors.day_limit} />
            </div>

            <div className="flex flex-wrap justify-end gap-3">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}
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
