export function alignEndDateWithStartDate(
    startDate: string,
    endDate: string,
): string {
    if (!startDate || !endDate || endDate >= startDate) {
        return endDate;
    }

    return startDate;
}
