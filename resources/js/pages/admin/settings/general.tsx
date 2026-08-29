import { Head, router } from '@inertiajs/react';
import { CalendarDays, Clock3, Info, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { update } from '@/actions/App/Http/Controllers/AdminSettingsController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';

const daysOfWeek = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 7 },
] as const;

export default function GeneralSettings({
    settings,
}: {
    settings: {
        counted_weekdays: number[];
        minimum_notice_days: number;
        enforce_leave_limits: boolean;
    };
}) {
    const [countedWeekdays, setCountedWeekdays] = useState(
        settings.counted_weekdays,
    );
    const [minimumNoticeDays, setMinimumNoticeDays] = useState(
        String(settings.minimum_notice_days),
    );
    const [minimumNoticeError, setMinimumNoticeError] = useState<string>();
    const [enforceLeaveLimits, setEnforceLeaveLimits] = useState(
        settings.enforce_leave_limits,
    );
    const [isSaving, setIsSaving] = useState(false);

    const selectedDayCount = countedWeekdays.length;

    function saveSettings(): void {
        setIsSaving(true);
        router.patch(
            update.url(),
            {
                counted_weekdays: countedWeekdays,
                minimum_notice_days: minimumNoticeDays,
                enforce_leave_limits: enforceLeaveLimits,
            },
            {
                preserveScroll: true,
                onError: (errors) =>
                    setMinimumNoticeError(errors.minimum_notice_days),
                onSuccess: () => setMinimumNoticeError(undefined),
                onFinish: () => setIsSaving(false),
            },
        );
    }

    return (
        <>
            <Head title="General settings" />
            <main className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                            Settings
                        </h1>
                        <p className="mt-1 text-sm text-[#78716C]">
                            Set the leave policies that will apply across the
                            system.
                        </p>
                    </div>

                    <nav
                        aria-label="Settings sections"
                        className="border-b border-[#E7E5E4]"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected="true"
                            className="border-b-2 border-[#292524] px-1 pb-3 text-sm font-medium text-[#292524]"
                        >
                            General
                        </button>
                    </nav>

                    <div className="rounded-lg border border-[#EF9F27] bg-[#FAEEDA] px-4 py-3 text-sm text-[#633806]">
                        <div className="flex items-start gap-2.5">
                            <Info className="mt-0.5 size-4 shrink-0" />
                            <p>
                                Counted leave days and minimum request notice
                                are active. Leave limits are{' '}
                                {enforceLeaveLimits ? 'enforced' : 'disabled'}.
                            </p>
                        </div>
                    </div>

                    <Card className="border-[#E7E5E4] bg-white py-0">
                        <CardHeader className="border-b border-[#E7E5E4] py-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-[#F5F5F4] p-2 text-[#57534E]">
                                    <CalendarDays className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-[#1C1917]">
                                        Counted leave days
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[#78716C]">
                                        Select the days of the week that count
                                        toward a leave request.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                                {daysOfWeek.map((day) => (
                                    <Toggle
                                        key={day.value}
                                        pressed={countedWeekdays.includes(
                                            day.value,
                                        )}
                                        onPressedChange={(pressed) =>
                                            setCountedWeekdays((currentDays) =>
                                                pressed
                                                    ? [
                                                          ...currentDays,
                                                          day.value,
                                                      ].sort(
                                                          (first, second) =>
                                                              first - second,
                                                      )
                                                    : currentDays.filter(
                                                          (value) =>
                                                              value !==
                                                              day.value,
                                                      ),
                                            )
                                        }
                                        aria-label={`${countedWeekdays.includes(day.value) ? 'Stop counting' : 'Count'} ${day.label}`}
                                        className="h-auto min-h-22 flex-col rounded-lg border border-[#E7E5E4] bg-white px-3 py-3 text-[#57534E] hover:bg-[#F5F5F4] hover:text-[#292524] data-[state=on]:border-[#639922] data-[state=on]:bg-[#EAF3DE] data-[state=on]:text-[#27500A]"
                                    >
                                        <span className="text-sm font-medium">
                                            {day.label.slice(0, 3)}
                                        </span>
                                        <span className="text-xs">
                                            {countedWeekdays.includes(day.value)
                                                ? 'Counted'
                                                : 'Excluded'}
                                        </span>
                                    </Toggle>
                                ))}
                            </div>
                            <p className="text-sm text-[#78716C]">
                                {selectedDayCount} of 7 days are counted. A
                                leave request spanning excluded days will not
                                include them in its total.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-[#E7E5E4] bg-white py-0">
                        <CardHeader className="border-b border-[#E7E5E4] py-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-[#F5F5F4] p-2 text-[#57534E]">
                                    <Settings2 className="size-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-[#1C1917]">
                                        Leave request policy
                                    </CardTitle>
                                    <CardDescription className="mt-1 text-[#78716C]">
                                        Define how far in advance employees must
                                        submit leave requests.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-[#E7E5E4] px-6">
                            <SettingRow
                                icon={<Settings2 className="size-5" />}
                                title="Enforce leave limits"
                                description="Apply each leave type's optional day limit to an employee's pending and approved leave requests."
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#57534E]">
                                        {enforceLeaveLimits
                                            ? 'Enabled'
                                            : 'Disabled'}
                                    </span>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={enforceLeaveLimits}
                                        aria-label="Enforce leave limits"
                                        onClick={() =>
                                            setEnforceLeaveLimits(
                                                (enabled) => !enabled,
                                            )
                                        }
                                        className="group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-[#D6D3D1] transition-colors focus-visible:ring-3 focus-visible:ring-[#D6D3D1]/50 focus-visible:outline-none data-[state=checked]:bg-[#292524]"
                                        data-state={
                                            enforceLeaveLimits
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                    >
                                        <span className="inline-block size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform group-data-[state=checked]:translate-x-5" />
                                    </button>
                                </div>
                            </SettingRow>
                            <SettingRow
                                icon={<Clock3 className="size-5" />}
                                title="Minimum request notice"
                                description="Require requests to be submitted this many days before the leave starts."
                            >
                                <NumberInput
                                    id="minimum-notice-days"
                                    value={minimumNoticeDays}
                                    onChange={(value) => {
                                        setMinimumNoticeDays(value);
                                        setMinimumNoticeError(undefined);
                                    }}
                                    error={minimumNoticeError}
                                    ariaLabel="Minimum request notice"
                                />
                            </SettingRow>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            disabled={isSaving || selectedDayCount === 0}
                            className="bg-black text-white hover:bg-[#292524] disabled:cursor-not-allowed disabled:bg-[#A8A29E] disabled:text-white"
                            onClick={saveSettings}
                        >
                            Save settings
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}

function SettingRow({
    icon,
    title,
    description,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[#57534E]">{icon}</div>
                <div>
                    <h2 className="text-sm font-medium text-[#292524]">
                        {title}
                    </h2>
                    <p className="mt-1 max-w-md text-sm text-[#78716C]">
                        {description}
                    </p>
                </div>
            </div>
            {children}
        </div>
    );
}

function NumberInput({
    id,
    value,
    onChange,
    error,
    ariaLabel,
}: {
    id: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    ariaLabel: string;
}) {
    return (
        <div className="grid gap-1">
            <div className="flex items-center gap-2">
                <Input
                    id={id}
                    type="number"
                    min="0"
                    disabled={onChange === undefined}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    aria-label={ariaLabel}
                    className="w-20 border-[#E7E5E4] bg-white text-center text-[#292524] shadow-none focus-visible:border-[#A8A29E] focus-visible:ring-[#D6D3D1]/50"
                />
                <span className="text-sm text-[#78716C]">days</span>
            </div>
            <InputError message={error} />
        </div>
    );
}
