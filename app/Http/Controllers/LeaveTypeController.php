<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use App\Models\LeaveType;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LeaveTypeController extends Controller
{
    /**
     * Display leave types available to administrators.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', LeaveType::class);

        return Inertia::render('admin/leave-types/index', [
            'leaveTypes' => LeaveType::query()
                ->withCount('leaveRequests')
                ->orderBy('name')
                ->get(),
        ]);
    }

    /**
     * Store a new leave type.
     */
    public function store(StoreLeaveTypeRequest $request, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('create', LeaveType::class);

        DB::transaction(function () use ($request, $auditLogger): void {
            $leaveType = LeaveType::create($request->validated());

            $auditLogger->log(
                action: 'leave_type.created',
                subject: $leaveType,
                description: "Created leave type {$leaveType->name}.",
                newValues: $leaveType->only(['name', 'description', 'day_limit']),
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type created.')]);

        return to_route('admin.leave-types.index');
    }

    /**
     * Update a leave type.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('update', $leaveType);

        DB::transaction(function () use ($request, $leaveType, $auditLogger): void {
            $leaveType = LeaveType::query()->lockForUpdate()->findOrFail($leaveType->id);
            $leaveType->fill($request->validated());
            $changes = $leaveType->getDirty();

            if ($changes === []) {
                return;
            }

            $oldValues = Arr::only($leaveType->getOriginal(), array_keys($changes));
            $leaveType->save();

            $auditLogger->log(
                action: 'leave_type.updated',
                subject: $leaveType,
                description: "Updated leave type {$leaveType->name}.",
                oldValues: $oldValues,
                newValues: $changes,
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type updated.')]);

        return to_route('admin.leave-types.index');
    }

    /**
     * Delete an unused leave type.
     */
    public function destroy(LeaveType $leaveType, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('delete', $leaveType);

        if ($leaveType->leaveRequests()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Leave types with existing requests cannot be deleted.')]);

            return back();
        }

        DB::transaction(function () use ($leaveType, $auditLogger): void {
            $leaveType = LeaveType::query()->lockForUpdate()->findOrFail($leaveType->id);
            $oldValues = $leaveType->only(['name', 'description', 'day_limit']);

            $leaveType->delete();

            $auditLogger->log(
                action: 'leave_type.deleted',
                subject: $leaveType,
                description: "Deleted leave type {$oldValues['name']}.",
                oldValues: $oldValues,
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type deleted.')]);

        return to_route('admin.leave-types.index');
    }
}
