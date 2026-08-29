<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class RoleBasedLoginResponse implements LoginResponseContract
{
    /**
     * Create the response for a successful password login.
     */
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        return redirect()->intended($this->destinationFor($request));
    }

    /**
     * Get the appropriate request list for the authenticated user.
     */
    private function destinationFor(Request $request): string
    {
        return $request->user()?->isApprover()
            ? route('admin.leave-requests.index')
            : route('leave-requests.index');
    }
}
