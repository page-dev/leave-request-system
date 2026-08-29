<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLeaveSettingsRequest;
use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    /**
     * Display the general administration settings design.
     */
    public function index(): Response
    {
        Gate::authorize('reviewAny', LeaveRequest::class);

        return Inertia::render('admin/settings/general', [
            'settings' => [
                'counted_weekdays' => LeaveSetting::countedWeekdays(),
                'minimum_notice_days' => LeaveSetting::minimumNoticeDays(),
                'enforce_leave_limits' => LeaveSetting::enforcesLeaveLimits(),
            ],
        ]);
    }

    /**
     * Update the leave-request settings.
     */
    public function update(UpdateLeaveSettingsRequest $request): RedirectResponse
    {
        Gate::authorize('reviewAny', LeaveRequest::class);

        $countedWeekdays = array_map(
            static fn (mixed $day): int => (int) $day,
            $request->validated('counted_weekdays'),
        );
        sort($countedWeekdays);

        LeaveSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'counted_weekdays' => $countedWeekdays,
                'minimum_notice_days' => $request->validated('minimum_notice_days'),
                'enforce_leave_limits' => $request->boolean('enforce_leave_limits'),
            ],
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave settings updated.')]);

        return to_route('admin.settings.general');
    }
}
