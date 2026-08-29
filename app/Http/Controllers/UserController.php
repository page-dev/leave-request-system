<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        return Inertia::render('admin/users/index', [
            'users' => User::query()
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
                )
                ->orderByDesc('is_active')
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->get(['id', 'first_name', 'last_name', 'email', 'role', 'is_active', 'created_at', 'updated_at']),
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
    public function store(StoreUserRequest $request): RedirectResponse
    {
        Gate::authorize('create', User::class);

        User::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created.')]);

        return to_route('admin.users.index');
    }

    /**
     * Update a user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        $data = $request->validated();

        if (! $request->filled('password')) {
            unset($data['password']);
        }

        return DB::transaction(function () use ($data, $user): RedirectResponse {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);

            if ($user->isApprover() && $data['role'] !== 'administrator' && $this->isLastActiveAdministrator($user)) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('At least one active administrator must remain.')]);

                return back();
            }

            $user->update($data);

            Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);

            return back();
        });
    }

    /**
     * Toggle a user's activation status while preserving administrator access.
     */
    public function toggleActivation(Request $request, User $user): RedirectResponse
    {
        Gate::authorize('update', $user);

        if ($user->is_active && $request->user()->is($user)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You cannot deactivate your own account.')]);

            return back();
        }

        return DB::transaction(function () use ($user): RedirectResponse {
            $user = User::query()->lockForUpdate()->findOrFail($user->id);

            if ($user->is_active && $this->isLastActiveAdministrator($user)) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('At least one active administrator must remain.')]);

                return back();
            }

            $user->update(['is_active' => ! $user->is_active]);

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
