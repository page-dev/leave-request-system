import type { LeaveRequest } from '../types';

export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${date.slice(0, 10)}T00:00:00`));
}

export function formatDateRange(request: LeaveRequest): string {
    const startDate = formatDate(request.start_date);
    const endDate = formatDate(request.end_date);

    return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
}

export function getLeaveRequestDays(
    startDate: string,
    endDate: string,
    countedWeekdays: number[],
): number | null {
    if (!startDate || !endDate) {
        return null;
    }

    const dates = new Date(`${startDate}T00:00:00`);
    const finalDate = new Date(`${endDate}T00:00:00`);
    let days = 0;

    while (dates <= finalDate) {
        const dayOfWeek = dates.getDay() || 7;

        if (countedWeekdays.includes(dayOfWeek)) {
            days += 1;
        }

        dates.setDate(dates.getDate() + 1);
    }

    return days;
}

export function formatRelativeTime(timestamp: string): string {
    const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(timestamp).getTime()) / 1_000),
    );

    if (elapsedSeconds < 60) {
        return 'just now';
    }

    const unit = (
        [
            ['day', 86_400],
            ['hour', 3_600],
            ['minute', 60],
        ] as const
    ).find(([, seconds]) => elapsedSeconds >= seconds);

    if (!unit) {
        return 'just now';
    }

    const [label, seconds] = unit;
    const value = Math.floor(elapsedSeconds / seconds);

    return `${value} ${label}${value === 1 ? '' : 's'} ago`;
}
