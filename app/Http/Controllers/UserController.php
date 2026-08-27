<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display employees for administrative leave-request filtering.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', User::class);

        return Inertia::render('admin/users/index', [
            'users' => User::query()
                ->where('role', 'employee')
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ]);
    }
}
