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
import type { LeaveRequest } from '../types';

export function DeleteRequestDialog({
    request,
    onOpenChange,
    onConfirm,
}: {
    request: LeaveRequest | null;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={request !== null} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white text-[#292524]">
                <DialogHeader>
                    <DialogTitle>Delete this leave request?</DialogTitle>
                    <DialogDescription className="text-[#78716C]">
                        This will permanently remove your pending{' '}
                        {request?.leave_type.name} request. This action cannot
                        be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        className="bg-black text-white"
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Keep request
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="border border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]"
                    >
                        <Trash2 />
                        Delete request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
