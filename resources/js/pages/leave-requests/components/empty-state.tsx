import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
    onNewRequest,
    hasFilters = false,
    onClearFilters,
}: {
    onNewRequest: () => void;
    hasFilters?: boolean;
    onClearFilters?: () => void;
}) {
    return (
        <div className="rounded-xl border border-dashed border-[#D6D3D1] bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-[#1C1917]">
                {hasFilters
                    ? 'No leave requests found'
                    : 'No leave requests yet'}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#78716C]">
                {hasFilters
                    ? 'Try changing or clearing the filters.'
                    : 'Submit a leave request when you are ready. Its review status will appear here.'}
            </p>
            {hasFilters && onClearFilters && (
                <Button
                    variant="outline"
                    className="mt-5 border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                    onClick={onClearFilters}
                >
                    Clear filters
                </Button>
            )}
            <Button
                variant="outline"
                className="mt-5 border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                onClick={onNewRequest}
            >
                <Plus />
                New request
            </Button>
        </div>
    );
}
