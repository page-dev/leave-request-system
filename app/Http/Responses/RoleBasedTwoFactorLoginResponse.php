<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;

class RoleBasedTwoFactorLoginResponse implements TwoFactorLoginResponseContract
{
    /**
     * Create the response for a successful two-factor login.
     */
    public function toResponse($request): JsonResponse|RedirectResponse
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
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
