export function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-xl border border-[#E7E5E4] bg-[#F5F5F4] p-5 shadow-sm">
            <p className="text-sm font-medium text-[#78716C]">{label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#1C1917]">
                {value}
            </p>
        </div>
    );
}
