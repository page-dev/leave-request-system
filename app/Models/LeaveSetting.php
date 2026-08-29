<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Database\Factories\LeaveSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['counted_weekdays', 'minimum_notice_days', 'enforce_leave_limits'])]
class LeaveSetting extends Model
{
    /** @use HasFactory<LeaveSettingFactory> */
    use HasFactory;

    /**
     * The weekdays counted by default before an administrator saves a policy.
     *
     * @var list<int>
     */
    public const DefaultCountedWeekdays = [1, 2, 3, 4, 5];

    /**
     * The number of calendar days a request must be submitted before it starts.
     */
    public const DefaultMinimumNoticeDays = 3;

    /**
     * Whether optional leave-type day limits are enforced.
     */
    public const DefaultEnforceLeaveLimits = false;

    /**
     * The model's default attribute values.
     *
     * @var array<string, string>
     */
    protected $attributes = [
        'counted_weekdays' => '[1,2,3,4,5]',
        'minimum_notice_days' => 3,
        'enforce_leave_limits' => false,
    ];

    /**
     * Get the globally configured weekdays that count toward leave.
     *
     * @return list<int>
     */
    public static function countedWeekdays(): array
    {
        $countedWeekdays = static::query()->find(1)?->counted_weekdays;

        return is_array($countedWeekdays) && $countedWeekdays !== []
            ? array_values(array_map(static fn (mixed $day): int => (int) $day, $countedWeekdays))
            : static::DefaultCountedWeekdays;
    }

    /**
     * Get the globally configured minimum advance notice for a leave request.
     */
    public static function minimumNoticeDays(): int
    {
        return static::query()->find(1)?->minimum_notice_days ?? static::DefaultMinimumNoticeDays;
    }

    /**
     * Determine whether leave-type day limits are enforced.
     */
    public static function enforcesLeaveLimits(): bool
    {
        return static::query()->find(1)?->enforce_leave_limits ?? static::DefaultEnforceLeaveLimits;
    }

    /**
     * Count the configured leave days within an inclusive date range.
     */
    public static function countLeaveDays(
        CarbonInterface $startDate,
        CarbonInterface $endDate,
        array $countedWeekdays = self::DefaultCountedWeekdays,
    ): int {
        return collect(CarbonPeriod::create($startDate->copy(), $endDate->copy()))
            ->filter(fn (CarbonInterface $date): bool => in_array($date->dayOfWeekIso, $countedWeekdays, true))
            ->count();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'counted_weekdays' => 'array',
            'minimum_notice_days' => 'integer',
            'enforce_leave_limits' => 'boolean',
        ];
    }
}
