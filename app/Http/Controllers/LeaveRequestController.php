<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewLeaveRequestRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    /**
     * Display the authenticated employee's leave requests.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', LeaveRequest::class);

        return Inertia::render('leave-requests/index', [
            'leaveRequests' => $request->user()
                ->leaveRequests()
                ->with('leaveType')
                ->when($request->filled('status'), fn (Builder $query) => $query->where('status', $request->string('status')->toString()))
                ->when($request->filled('leave_type_id'), fn (Builder $query) => $query->where('leave_type_id', $request->integer('leave_type_id')))
                ->latest()
                ->get(),
            'leaveTypes' => LeaveType::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Display the leave request creation form.
     */
    public function create(): Response
    {
        Gate::authorize('create', LeaveRequest::class);

        return Inertia::render('leave-requests/create', [
            'leaveTypes' => LeaveType::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a leave request for the authenticated employee.
     */
    public function store(StoreLeaveRequestRequest $request): RedirectResponse
    {
        Gate::authorize('create', LeaveRequest::class);

        $request->user()->leaveRequests()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave request submitted.')]);

        return to_route('leave-requests.index');
    }

    /**
     * Display a leave request.
     */
    public function show(LeaveRequest $leaveRequest): Response
    {
        Gate::authorize('view', $leaveRequest);

        return Inertia::render('leave-requests/show', [
            'leaveRequest' => $leaveRequest->load(['leaveType', 'user:id,name,email', 'reviewer:id,name']),
        ]);
    }

    /**
     * Display the leave request editing form.
     */
    public function edit(LeaveRequest $leaveRequest): Response
    {
        Gate::authorize('update', $leaveRequest);

        return Inertia::render('leave-requests/edit', [
            'leaveRequest' => $leaveRequest,
            'leaveTypes' => LeaveType::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update a pending leave request owned by the authenticated employee.
     */
    public function update(UpdateLeaveRequestRequest $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        Gate::authorize('update', $leaveRequest);

        $leaveRequest->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave request updated.')]);

        return to_route('leave-requests.index');
    }

    /**
     * Delete a pending leave request owned by the authenticated employee.
     */
    public function destroy(LeaveRequest $leaveRequest): RedirectResponse
    {
        Gate::authorize('delete', $leaveRequest);

        $leaveRequest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave request deleted.')]);

        return to_route('leave-requests.index');
    }

    /**
     * Display leave requests awaiting administrative review.
     */
    public function reviewIndex(Request $request): Response
    {
        Gate::authorize('reviewAny', LeaveRequest::class);

        $search = $request->string('search')->trim()->toString();

        return Inertia::render('admin/leave-requests/index', [
            'leaveRequests' => LeaveRequest::query()
                ->with(['user:id,name,email', 'leaveType', 'reviewer:id,name'])
                ->when($search !== '', function (Builder $query) use ($search): void {
                    $query->whereHas('user', function (Builder $query) use ($search): void {
                        $query
                            ->whereLike('name', "%{$search}%")
                            ->orWhereLike('email', "%{$search}%");
                    });
                })
                ->when($request->filled('status'), fn (Builder $query) => $query->where('status', $request->string('status')->toString()))
                ->when($request->filled('leave_type_id'), fn (Builder $query) => $query->where('leave_type_id', $request->integer('leave_type_id')))
                ->when($request->filled('user_id'), fn (Builder $query) => $query->where('user_id', $request->integer('user_id')))
                ->latest()
                ->get(),
            'leaveTypes' => LeaveType::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'status' => $request->filled('status') ? $request->string('status')->toString() : null,
                'leave_type_id' => $request->filled('leave_type_id') ? $request->integer('leave_type_id') : null,
            ],
        ]);
    }

    /**
     * Approve a pending leave request.
     */
    public function approve(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        return $this->review($request, $leaveRequest, 'approved');
    }

    /**
     * Reject a pending leave request.
     */
    public function reject(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest): RedirectResponse
    {
        return $this->review($request, $leaveRequest, 'rejected');
    }

    /**
     * Apply a final review decision only if the request is still pending.
     */
    private function review(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest, string $status): RedirectResponse
    {
        Gate::authorize('review', $leaveRequest);

        $updated = LeaveRequest::query()
            ->whereKey($leaveRequest->getKey())
            ->where('status', 'pending')
            ->update([
                'status' => $status,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_note' => $request->validated('review_note'),
            ]);

        if ($updated === 0) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('This leave request has already been reviewed.')]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => $status === 'approved' ? __('Leave request approved.') : __('Leave request rejected.')]);

        return to_route('admin.leave-requests.index');
    }
}
