<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLeaveSettingsRequest;
use App\Models\LeaveRequest;
use App\Models\LeaveSetting;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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
    public function update(UpdateLeaveSettingsRequest $request, AuditLogger $auditLogger): RedirectResponse
    {
        Gate::authorize('reviewAny', LeaveRequest::class);

        $countedWeekdays = array_map(
            static fn (mixed $day): int => (int) $day,
            $request->validated('counted_weekdays'),
        );
        sort($countedWeekdays);

        $settingsValues = [
            'counted_weekdays' => $countedWeekdays,
            'minimum_notice_days' => $request->validated('minimum_notice_days'),
            'enforce_leave_limits' => $request->boolean('enforce_leave_limits'),
        ];

        DB::transaction(function () use ($settingsValues, $auditLogger): void {
            $settings = LeaveSetting::query()->lockForUpdate()->find(1);

            if ($settings === null) {
                $settings = new LeaveSetting;
                $settings->id = 1;
                $settings->fill($settingsValues);
                $settings->save();

                $auditLogger->log(
                    action: 'leave_settings.updated',
                    subject: $settings,
                    description: 'Configured general leave settings.',
                    newValues: $settingsValues,
                );

                return;
            }

            $settings->fill($settingsValues);
            $changes = $settings->getDirty();

            if ($changes === []) {
                return;
            }

            $oldValues = $settings->only(array_keys($changes));
            $settings->save();

            $auditLogger->log(
                action: 'leave_settings.updated',
                subject: $settings,
                description: 'Updated general leave settings.',
                oldValues: $oldValues,
                newValues: $changes,
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Leave settings updated.')]);

        return to_route('admin.settings.general');
    }
}
