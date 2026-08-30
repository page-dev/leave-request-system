<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewLeaveRequestRequest;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Requests\UpdateLeaveRequestRequest;
use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Models\LeaveType;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Context;
use Illuminate\Support\Facades\DB;
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

        $startDate = $request->string('start_date')->trim()->toString();
        $endDate = $request->string('end_date')->trim()->toString();
        $countedWeekdays = $this->countedWeekdays();
        $enforceLeaveLimits = LeaveSetting::enforcesLeaveLimits();
        $user = $request->user();

        if (! $user instanceof User) {
            abort(403);
        }

        return Inertia::render('leave-requests/index', [
            'leaveRequests' => $user
                ->leaveRequests()
                ->with(['leaveType', 'reviewer:id,name'])
                ->when($startDate !== '' && $endDate !== '', fn (Builder $query) => $query
                    ->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate))
                ->when($request->filled('status'), fn (Builder $query) => $query->where('status', $request->string('status')->toString()))
                ->when($request->filled('leave_type_id'), fn (Builder $query) => $query->where('leave_type_id', $request->integer('leave_type_id')))
                ->latest()
                ->get(),
            'leaveTypes' => $this->leaveTypesForUser($user, $enforceLeaveLimits, $countedWeekdays),
            'countedWeekdays' => $countedWeekdays,
            'enforceLeaveLimits' => $enforceLeaveLimits,
            'filters' => [
                'start_date' => $startDate !== '' ? $startDate : null,
                'end_date' => $endDate !== '' ? $endDate : null,
                'status' => $request->filled('status') ? $request->string('status')->toString() : null,
                'leave_type_id' => $request->filled('leave_type_id') ? $request->integer('leave_type_id') : null,
            ],
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

        $this->countedWeekdays();

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

        $this->countedWeekdays();

        $search = $request->string('search')->trim()->toString();
        $startDate = $request->string('start_date')->trim()->toString();
        $endDate = $request->string('end_date')->trim()->toString();

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
                ->when($startDate !== '' && $endDate !== '', fn (Builder $query) => $query
                    ->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate))
                ->when($request->filled('status'), fn (Builder $query) => $query->where('status', $request->string('status')->toString()))
                ->when($request->filled('leave_type_id'), fn (Builder $query) => $query->where('leave_type_id', $request->integer('leave_type_id')))
                ->when($request->filled('user_id'), fn (Builder $query) => $query->where('user_id', $request->integer('user_id')))
                ->latest()
                ->get(),
            'leaveTypes' => LeaveType::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'start_date' => $startDate !== '' ? $startDate : null,
                'end_date' => $endDate !== '' ? $endDate : null,
                'status' => $request->filled('status') ? $request->string('status')->toString() : null,
                'leave_type_id' => $request->filled('leave_type_id') ? $request->integer('leave_type_id') : null,
            ],
        ]);
    }

    /**
     * Approve a pending leave request.
     */
    public function approve(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest, AuditLogger $auditLogger): RedirectResponse
    {
        return $this->review($request, $leaveRequest, 'approved', $auditLogger);
    }

    /**
     * Reject a pending leave request.
     */
    public function reject(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest, AuditLogger $auditLogger): RedirectResponse
    {
        return $this->review($request, $leaveRequest, 'rejected', $auditLogger);
    }

    /**
     * Apply a final review decision only if the request is still pending.
     */
    private function review(ReviewLeaveRequestRequest $request, LeaveRequest $leaveRequest, string $status, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('review', $leaveRequest);

        $reviewed = DB::transaction(function () use ($request, $leaveRequest, $status, $auditLogger): bool {
            $leaveRequest = LeaveRequest::query()->lockForUpdate()->findOrFail($leaveRequest->id);

            if ($leaveRequest->status !== 'pending') {
                return false;
            }

            $oldValues = $leaveRequest->only(['status', 'reviewed_by', 'reviewed_at', 'review_note']);
            $leaveRequest->forceFill([
                'status' => $status,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
                'review_note' => $request->validated('review_note'),
            ])->save();

            $auditLogger->log(
                action: "leave_request.{$status}",
                subject: $leaveRequest,
                description: ucfirst($status)." leave request #{$leaveRequest->id}.",
                oldValues: $oldValues,
                newValues: $leaveRequest->only(['status', 'reviewed_by', 'reviewed_at', 'review_note']),
            );

            return true;
        });

        if (! $reviewed) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('This leave request has already been reviewed.')]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => $status === 'approved' ? __('Leave request approved.') : __('Leave request rejected.')]);

        return to_route('admin.leave-requests.index');
    }

    /**
     * Load the configured weekdays once for the current request.
     *
     * @return list<int>
     */
    private function countedWeekdays(): array
    {
        $countedWeekdays = LeaveSetting::countedWeekdays();

        Context::add('leave.counted_weekdays', $countedWeekdays);

        return $countedWeekdays;
    }

    /**
     * Get selectable leave types with the authenticated employee's used days when limits are enforced.
     *
     * @param  list<int>  $countedWeekdays
     * @return Collection<int, LeaveType>
     */
    private function leaveTypesForUser(User $user, bool $enforceLeaveLimits, array $countedWeekdays): Collection
    {
        $leaveTypes = LeaveType::query()
            ->orderBy('name')
            ->get(['id', 'name', 'day_limit']);

        if (! $enforceLeaveLimits) {
            return $leaveTypes;
        }

        $usedDaysByLeaveType = $user->leaveRequests()
            ->whereIn('status', ['pending', 'approved'])
            ->get(['leave_type_id', 'start_date', 'end_date'])
            ->groupBy('leave_type_id')
            ->map(fn (Collection $leaveRequests): int => $leaveRequests->sum(
                fn (LeaveRequest $leaveRequest): int => LeaveSetting::countLeaveDays(
                    $leaveRequest->start_date,
                    $leaveRequest->end_date,
                    $countedWeekdays,
                ),
            ));

        $leaveTypes
            ->filter(fn (LeaveType $leaveType): bool => $leaveType->day_limit !== null)
            ->each(fn (LeaveType $leaveType) => $leaveType->setAttribute(
                'used_days',
                (int) ($usedDaysByLeaveType->get($leaveType->getKey()) ?? 0),
            ));

        return $leaveTypes;
    }
}
