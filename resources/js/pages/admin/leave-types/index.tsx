import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/LeaveTypeController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DeleteLeaveTypeDialog } from './components/delete-leave-type-dialog';
import { EditLeaveTypeDialog } from './components/edit-leave-type-dialog';
import { NewLeaveTypeDialog } from './components/new-leave-type-dialog';
import type { LeaveType } from './types';

export default function LeaveTypesIndex({
    leaveTypes,
}: {
    leaveTypes: LeaveType[];
}) {
    const [leaveTypeToDelete, setLeaveTypeToDelete] =
        useState<LeaveType | null>(null);
    const [leaveTypeToEdit, setLeaveTypeToEdit] = useState<LeaveType | null>(
        null,
    );
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteLeaveType = () => {
        if (!leaveTypeToDelete) {
            return;
        }

        setIsDeleting(true);
        router.delete(destroy.url(leaveTypeToDelete), {
            preserveScroll: true,
            onSuccess: () => setLeaveTypeToDelete(null),
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="Leave types" />
            <main className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-[#1C1917]">
                                Leave types
                            </h1>
                            <p className="mt-1 text-sm text-[#78716C]">
                                Create and maintain the types of leave employees
                                can request.
                            </p>
                        </div>
                        <Button
                            className="bg-black text-white hover:bg-[#292524]"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <Plus />
                            New leave type
                        </Button>
                    </div>

                    {leaveTypes.length === 0 ? (
                        <Card className="items-center border-[#E7E5E4] bg-white py-16 text-center">
                            <div className="rounded-full bg-[#F5F5F4] p-3 text-[#57534E]">
                                <Tags className="size-6" />
                            </div>
                            <CardHeader className="px-6">
                                <CardTitle className="text-[#1C1917]">
                                    No leave types yet
                                </CardTitle>
                                <CardDescription className="text-[#78716C]">
                                    Add a leave type before employees submit
                                    their requests.
                                </CardDescription>
                            </CardHeader>
                            <Button
                                className="bg-black text-white hover:bg-[#292524]"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                <Plus />
                                New leave type
                            </Button>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden border-[#E7E5E4] bg-white py-0">
                            <CardContent className="overflow-x-auto p-0">
                                <table className="w-full min-w-175 text-left text-sm">
                                    <thead className="border-b border-[#E7E5E4] bg-[#F5F5F4] text-xs font-medium text-[#57534E]">
                                        <tr>
                                            <th className="px-6 py-3">Name</th>
                                            <th className="px-6 py-3">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Day limit
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Requests
                                            </th>
                                            <th className="px-6 py-3 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E7E5E4]">
                                        {leaveTypes.map((leaveType) => {
                                            const requestCount =
                                                leaveType.leave_requests_count ??
                                                0;

                                            return (
                                                <tr key={leaveType.id}>
                                                    <td className="px-6 py-4 font-medium text-[#292524]">
                                                        {leaveType.name}
                                                    </td>
                                                    <td className="max-w-xl px-6 py-4 text-[#57534E]">
                                                        {leaveType.description}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-[#57534E]">
                                                        {leaveType.day_limit ??
                                                            'No limit'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-[#57534E]">
                                                        {requestCount}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-[#E7E5E4] bg-white text-[#292524] hover:bg-[#F5F5F4] hover:text-[#292524]"
                                                                onClick={() =>
                                                                    setLeaveTypeToEdit(
                                                                        leaveType,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil />
                                                                Edit
                                                            </Button>
                                                            {requestCount ===
                                                            0 ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-[#E24B4A] bg-white text-[#791F1F] hover:bg-[#FCEBEB] hover:text-[#791F1F]"
                                                                    onClick={() =>
                                                                        setLeaveTypeToDelete(
                                                                            leaveType,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                    Delete
                                                                </Button>
                                                            ) : (
                                                                <span className="self-center text-xs text-[#78716C]">
                                                                    In use
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>

            <DeleteLeaveTypeDialog
                leaveType={leaveTypeToDelete}
                isDeleting={isDeleting}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setLeaveTypeToDelete(null);
                    }
                }}
                onConfirm={deleteLeaveType}
            />
            <NewLeaveTypeDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            <EditLeaveTypeDialog
                leaveType={leaveTypeToEdit}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setLeaveTypeToEdit(null);
                    }
                }}
            />
        </>
    );
}
