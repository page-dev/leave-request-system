<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuditLogger
{
    /**
     * Create an audit logger for the current request.
     */
    public function __construct(private Request $request) {}

    /**
     * Record a consequential administrative action.
     *
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public function log(
        string $action,
        ?Model $subject = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $this->request->user()?->getAuthIdentifier(),
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'old_values' => $this->withoutSensitiveValues($oldValues),
            'new_values' => $this->withoutSensitiveValues($newValues),
            'ip_address' => $this->request->ip(),
            'user_agent' => $this->request->userAgent(),
        ]);
    }

    /**
     * Remove credentials and authentication material before persisting values.
     *
     * @param  array<string, mixed>|null  $values
     * @return array<string, mixed>|null
     */
    private function withoutSensitiveValues(?array $values): ?array
    {
        if ($values === null) {
            return null;
        }

        return collect($values)
            ->reject(fn (mixed $value, string $key): bool => $this->isSensitiveKey($key))
            ->map(fn (mixed $value): mixed => is_array($value) ? $this->withoutSensitiveValues($value) : $value)
            ->all();
    }

    /**
     * Determine whether an audit value key can contain authentication material.
     */
    private function isSensitiveKey(string $key): bool
    {
        $normalizedKey = strtolower($key);

        return str_contains($normalizedKey, 'password')
            || str_contains($normalizedKey, 'token')
            || str_contains($normalizedKey, 'secret')
            || str_contains($normalizedKey, 'recovery')
            || str_contains($normalizedKey, 'passkey')
            || str_contains($normalizedKey, 'credential')
            || str_contains($normalizedKey, 'api_key')
            || str_contains($normalizedKey, 'session')
            || str_contains($normalizedKey, 'csrf');
    }
}
