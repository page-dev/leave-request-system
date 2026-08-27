import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { store } from '@/actions/App/Http/Controllers/LeaveRequestController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { LeaveType } from '../types';

type NewRequestDialogProps = {
    leaveTypes: LeaveType[];
    isOpen: boolean;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    dayCount: number | null;
    onOpenChange: (open: boolean) => void;
    onLeaveTypeChange: (value: string) => void;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onSuccess: () => void;
};

export function NewRequestDialog({
    leaveTypes,
    isOpen,
    leaveTypeId,
    startDate,
    endDate,
    dayCount,
    onOpenChange,
    onLeaveTypeChange,
    onStartDateChange,
    onEndDateChange,
    onSuccess,
}: NewRequestDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto bg-white text-[#292524]">
                <DialogHeader>
                    <DialogTitle>New leave request</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        Submit the dates and reason for your time away.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...store.form()}
                    resetOnSuccess
                    onSuccess={onSuccess}
                    className="grid gap-5"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="leave_type_id">
                                    Leave type
                                </Label>
                                <input
                                    type="hidden"
                                    name="leave_type_id"
                                    value={leaveTypeId}
                                />
                                <Select
                                    value={leaveTypeId}
                                    onValueChange={onLeaveTypeChange}
                                >
                                    <SelectTrigger
                                        id="leave_type_id"
                                        className="w-full border-[#E7E5E4] bg-white text-black shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50 dark:!bg-white dark:!text-black [&_svg]:!text-black [&_svg]:!opacity-100"
                                    >
                                        <SelectValue placeholder="Select a leave type" />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#E7E5E4]! bg-white! text-black! dark:bg-white! dark:text-black!">
                                        {leaveTypes.map((leaveType) => (
                                            <SelectItem
                                                key={leaveType.id}
                                                value={String(leaveType.id)}
                                                className="text-black focus:bg-[#F5F5F4] focus:text-black"
                                            >
                                                {leaveType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.leave_type_id} />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_date">
                                        Start date
                                    </Label>
                                    <Input
                                        id="start_date"
                                        name="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(event) =>
                                            onStartDateChange(
                                                event.target.value,
                                            )
                                        }
                                        className="border-[#E7E5E4] bg-white text-[#292524] scheme-light shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                        required
                                    />
                                    {/* <InputError message={errors.start_date} /> */}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end_date">End date</Label>
                                    <Input
                                        id="end_date"
                                        name="end_date"
                                        type="date"
                                        min={startDate || undefined}
                                        value={endDate}
                                        onChange={(event) =>
                                            onEndDateChange(event.target.value)
                                        }
                                        className="border-[#E7E5E4] bg-white text-[#292524] scheme-light shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                                        required
                                    />
                                </div>
                            </div>

                            {errors.end_date && (
                                <Card
                                    role="alert"
                                    className="border-[#E24B4A] bg-white py-0 text-[#791F1F]"
                                >
                                    <CardContent className="flex items-start gap-3 p-3 text-sm">
                                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                                        <p>{errors.end_date}</p>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="day_count">Total days</Label>
                                <Input
                                    id="day_count"
                                    value={
                                        dayCount === null
                                            ? 'Select dates'
                                            : dayCount
                                    }
                                    readOnly
                                    className="border-[#E7E5E4] bg-[#F5F5F4] text-[#57534E] shadow-none"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reason">Reason or notes</Label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    required
                                    rows={4}
                                    className="w-full resize-y rounded-md border border-[#E7E5E4] bg-white px-3 py-2 text-sm text-[#292524] shadow-none outline-none placeholder:text-[#A8A29E] focus-visible:border-[#A8A29E] focus-visible:ring-[3px] focus-visible:ring-[#D6D3D1]/50"
                                    placeholder="Briefly describe your leave request"
                                />
                                <InputError message={errors.reason} />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-transparent bg-[#F5F5F4] text-[#44403C] hover:bg-[#E7E5E4] hover:text-[#292524]"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-black text-white hover:bg-[#1C1917]"
                                    disabled={processing || !leaveTypeId}
                                >
                                    Submit request
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
