<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\AuditLogger;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display users for administrators to manage.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:active,inactive'],
            'role' => ['nullable', 'in:employee,administrator'],
        ]);

        $users = User::query()
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $searchTerm = '%'.Str::lower($search).'%';

                $query->where(function (Builder $query) use ($searchTerm): void {
                    $query
                        ->whereRaw("LOWER(first_name || ' ' || last_name) LIKE ?", [$searchTerm])
                        ->orWhereRaw('LOWER(first_name) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(last_name) LIKE ?', [$searchTerm])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$searchTerm]);
                });
            })
            ->when(
                $filters['status'] ?? null,
                fn (Builder $query, string $status): Builder => $query->where('is_active', $status === 'active'),
            )
            ->when(
                $filters['role'] ?? null,
                fn (Builder $query, string $role): Builder => $query->where('role', $role),
            );

        $userCounts = [
            'active' => (clone $users)->where('is_active', true)->count(),
            'inactive' => (clone $users)->where('is_active', false)->count(),
            'active_administrators' => (clone $users)
                ->where('is_active', true)
                ->where('role', 'administrator')
                ->count(),
        ];

        return Inertia::render('admin/users/index', [
            'users' => $users
                ->orderByDesc('is_active')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->paginate(15, ['id', 'first_name', 'last_name', 'email', 'role', 'is_active', 'created_at', 'updated_at'])
                ->withQueryString(),
            'userCounts' => $userCounts,
            'filters' => [
                'search' => $filters['search'] ?? null,
                'status' => $filters['status'] ?? null,
                'role' => $filters['role'] ?? null,
            ],
            'activeAdministratorCount' => User::query()
                ->where('role', 'administrator')
                ->where('is_active', true)
                ->count(),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('create', User::class);

        DB::transaction(function () use ($request, $auditLogger): void {
            $user = User::create($request->validated());

            $auditLogger->log(
                action: 'user.created',
                subject: $user,
                description: "Created user {$user->name}.",
                newValues: $user->only(['first_name', 'last_name', 'email', 'role', 'is_active']),
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created.')]);

        return to_route('admin.users.index');
    }

    /**
     * Update a user.
     */
    public function update(UpdateUserRequest $request, User $user, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('update', $user);

        $data = $request->validated();

        if (! $request->filled('password')) {
            unset($data['password']);
        }

        return DB::transaction(function () use ($data, $user, $auditLogger): RedirectResponse {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);

            if ($user->isApprover() && $data['role'] !== 'administrator' && $this->isLastActiveAdministrator($user)) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('At least one active administrator must remain.')]);

                return back();
            }

            $user->fill($data);
            $changes = $user->getDirty();
            $oldValues = Arr::only($user->getOriginal(), array_keys($changes));
            $user->save();

            $safeChanges = Arr::except($changes, ['password']);

            if ($safeChanges !== []) {
                $auditLogger->log(
                    action: 'user.updated',
                    subject: $user,
                    description: "Updated user {$user->name}.",
                    oldValues: Arr::only($oldValues, array_keys($safeChanges)),
                    newValues: $safeChanges,
                );
            }

            if (array_key_exists('role', $changes)) {
                $auditLogger->log(
                    action: 'user.role_changed',
                    subject: $user,
                    description: "Changed {$user->name}'s role.",
                    oldValues: ['role' => $oldValues['role']],
                    newValues: ['role' => $changes['role']],
                );
            }

            if (array_key_exists('password', $changes)) {
                $auditLogger->log(
                    action: 'user.password_reset',
                    subject: $user,
                    description: "Reset password for {$user->name}.",
                );
            }

            Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);

            return back();
        });
    }

    /**
     * Toggle a user's activation status while preserving administrator access.
     */
    public function toggleActivation(Request $request, User $user, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('update', $user);

        if ($user->is_active && $request->user()->is($user)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You cannot deactivate your own account.')]);

            return back();
        }

        return DB::transaction(function () use ($user, $auditLogger): RedirectResponse {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);

            if ($user->is_active && $this->isLastActiveAdministrator($user)) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('At least one active administrator must remain.')]);

                return back();
            }

            $oldActiveState = $user->is_active;
            $user->update(['is_active' => ! $user->is_active]);

            $auditLogger->log(
                action: $user->is_active ? 'user.activated' : 'user.deactivated',
                subject: $user,
                description: ($user->is_active ? 'Activated' : 'Deactivated')." user {$user->name}.",
                oldValues: ['is_active' => $oldActiveState],
                newValues: ['is_active' => $user->is_active],
            );

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => $user->is_active ? __('User activated.') : __('User deactivated.'),
            ]);

            return back();
        });
    }

    /**
     * Determine whether deactivating or demoting a user would leave no active administrator.
     */
    private function isLastActiveAdministrator(User $user): bool
    {
        return $user->isApprover()
            && $user->is_active
            && User::query()
                ->where('role', 'administrator')
                ->where('is_active', true)
                ->lockForUpdate()
                ->get()
                ->count() === 1;
    }
}
