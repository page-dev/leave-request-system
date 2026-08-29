import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LeaveType } from '../types';

export function DeleteLeaveTypeDialog({
    leaveType,
    isDeleting,
    onOpenChange,
    onConfirm,
}: {
    leaveType: LeaveType | null;
    isDeleting: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={leaveType !== null} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#E7E5E4] bg-white text-[#292524]">
                <DialogHeader>
                    <DialogTitle>Delete this leave type?</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        {leaveType?.name} will be permanently removed. This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                        onClick={() => onOpenChange(false)}
                    >
                        Keep leave type
                    </Button>
                    <Button
                        type="button"
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="border border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]"
                    >
                        <Trash2 />
                        Delete leave type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
