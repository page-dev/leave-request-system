<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display the administrator audit history.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', AuditLog::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'action' => ['nullable', 'string', 'max:255'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $auditLogs = AuditLog::query()
            ->with('user:id,name,email')
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $searchTerm = "%{$search}%";

                $query->where(function (Builder $query) use ($searchTerm, $search): void {
                    $query
                        ->whereLike('action', $searchTerm)
                        ->orWhereLike('description', $searchTerm)
                        ->orWhereHas('user', fn (Builder $query) => $query
                            ->whereLike('name', $searchTerm)
                            ->orWhereLike('email', $searchTerm));

                    if (is_numeric($search)) {
                        $query->orWhere('subject_id', (int) $search);
                    }
                });
            })
            ->when($filters['action'] ?? null, fn (Builder $query, string $action) => $query->where('action', $action))
            ->when($filters['user_id'] ?? null, fn (Builder $query, int $userId) => $query->where('user_id', $userId))
            ->when($filters['start_date'] ?? null, fn (Builder $query, string $startDate) => $query->whereDate('created_at', '>=', $startDate))
            ->when($filters['end_date'] ?? null, fn (Builder $query, string $endDate) => $query->whereDate('created_at', '<=', $endDate))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (AuditLog $auditLog): array => [
                'id' => $auditLog->id,
                'action' => $auditLog->action,
                'subject_type' => $this->subjectLabel($auditLog->subject_type),
                'subject_id' => $auditLog->subject_id,
                'description' => $auditLog->description,
                'old_values' => $auditLog->old_values,
                'new_values' => $auditLog->new_values,
                'created_at' => $auditLog->created_at,
                'user' => $auditLog->user === null ? null : [
                    'id' => $auditLog->user->id,
                    'name' => $auditLog->user->name,
                    'email' => $auditLog->user->email,
                ],
            ]);

        return Inertia::render('admin/audit-logs/index', [
            'auditLogs' => $auditLogs,
            'actions' => AuditLog::query()->distinct()->orderBy('action')->pluck('action')->values(),
            'administrators' => User::query()
                ->where('role', 'administrator')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(['id', 'name', 'email']),
            'filters' => [
                'search' => $filters['search'] ?? null,
                'action' => $filters['action'] ?? null,
                'user_id' => $filters['user_id'] ?? null,
                'start_date' => $filters['start_date'] ?? null,
                'end_date' => $filters['end_date'] ?? null,
            ],
        ]);
    }

    /**
     * Convert a stored model class into a concise target label.
     */
    private function subjectLabel(?string $subjectType): ?string
    {
        return match ($subjectType) {
            'App\\Models\\LeaveRequest' => 'Leave request',
            'App\\Models\\LeaveSetting' => 'General settings',
            'App\\Models\\LeaveType' => 'Leave type',
            'App\\Models\\User' => 'User',
            default => null,
        };
    }
}
