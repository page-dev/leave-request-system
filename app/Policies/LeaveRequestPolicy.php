<?php

namespace App\Policies;

use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return ! $user->isApprover();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->isApprover() || $leaveRequest->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return ! $user->isApprover();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, LeaveRequest $leaveRequest): bool
    {
        return $leaveRequest->user_id === $user->id && $leaveRequest->status === 'pending';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, LeaveRequest $leaveRequest): bool
    {
        return $leaveRequest->user_id === $user->id && $leaveRequest->status === 'pending';
    }

    /**
     * Determine whether the user can list requests awaiting review.
     */
    public function reviewAny(User $user): bool
    {
        return $user->isApprover();
    }

    /**
     * Determine whether the user can review a pending leave request.
     */
    public function review(User $user, LeaveRequest $leaveRequest): bool
    {
        return $user->isApprover() && $leaveRequest->status === 'pending';
    }
}
