<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaveTypeRequest;
use App\Http\Requests\UpdateLeaveTypeRequest;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;
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
    public function store(StoreLeaveTypeRequest $request): RedirectResponse
    {
        Gate::authorize('create', LeaveType::class);

        LeaveType::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type created.')]);

        return to_route('admin.leave-types.index');
    }

    /**
     * Update a leave type.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType): RedirectResponse
    {
        Gate::authorize('update', $leaveType);

        $leaveType->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type updated.')]);

        return to_route('admin.leave-types.index');
    }

    /**
     * Delete an unused leave type.
     */
    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        Gate::authorize('delete', $leaveType);

        if ($leaveType->leaveRequests()->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Leave types with existing requests cannot be deleted.')]);

            return back();
        }

        $leaveType->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave type deleted.')]);

        return to_route('admin.leave-types.index');
    }
}
