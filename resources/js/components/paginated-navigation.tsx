import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import type { Paginator } from '@/types/pagination';

export function PaginatedNavigation<T>({
    paginator,
    ariaLabel,
}: {
    paginator: Paginator<T>;
    ariaLabel: string;
}) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <Pagination aria-label={ariaLabel}>
            <PaginationContent>
                {paginator.links.map((link) => {
                    const label = paginationLabel(link.label);
                    const isPrevious = label === 'Previous';
                    const isNext = label === 'Next';

                    if (link.url === null) {
                        return (
                            <PaginationItem key={link.label}>
                                {label === '...' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <span className="flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm text-[#A8A29E]">
                                        {label}
                                    </span>
                                )}
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={link.label}>
                            {isPrevious ? (
                                <PaginationLink
                                    asChild
                                    size="default"
                                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                >
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        <ChevronLeft />
                                        Previous
                                    </Link>
                                </PaginationLink>
                            ) : isNext ? (
                                <PaginationLink
                                    asChild
                                    size="default"
                                    className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                >
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        Next
                                        <ChevronRight />
                                    </Link>
                                </PaginationLink>
                            ) : (
                                <PaginationLink
                                    asChild
                                    isActive={link.active}
                                    className={
                                        link.active
                                            ? 'border-[#292524] bg-[#292524] text-white hover:bg-[#44403C] hover:text-white'
                                            : 'border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]'
                                    }
                                >
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        {label}
                                    </Link>
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}

function paginationLabel(label: string): string {
    if (label.includes('Previous')) {
        return 'Previous';
    }

    if (label.includes('Next')) {
        return 'Next';
    }

    return label.replace(/<[^>]*>/g, '');
}
