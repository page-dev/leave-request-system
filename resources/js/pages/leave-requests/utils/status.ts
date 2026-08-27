import { Check, Clock3, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LeaveRequestStatus } from '../types';

type StatusStyle = {
    badge: string;
    banner: string;
    Icon: LucideIcon;
};

export const leaveRequestStatusStyles: Record<LeaveRequestStatus, StatusStyle> =
    {
        pending: {
            badge: 'border-[#EF9F27] bg-[#FAEEDA] text-[#633806]',
            banner: 'border-[#EF9F27] bg-[#FAEEDA] text-[#633806]',
            Icon: Clock3,
        },
        approved: {
            badge: 'border-[#639922] bg-[#EAF3DE] text-[#27500A]',
            banner: 'border-[#639922] bg-[#EAF3DE] text-[#27500A]',
            Icon: Check,
        },
        rejected: {
            badge: 'border-[#E24B4A] bg-[#FCEBEB] text-[#791F1F]',
            banner: 'border-[#E24B4A] bg-[#FCEBEB] text-[#791F1F]',
            Icon: X,
        },
    };
