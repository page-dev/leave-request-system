<?php

use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\UserController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', fn (): RedirectResponse => to_route('login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('leave-requests', LeaveRequestController::class);

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('settings', [AdminSettingsController::class, 'index'])->name('settings.general');
        Route::patch('settings', [AdminSettingsController::class, 'update'])->name('settings.update');
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::resource('users', UserController::class)->only(['index', 'store', 'update']);
        Route::patch('users/{user}/toggle-activation', [UserController::class, 'toggleActivation'])->name('users.toggle-activation');
        Route::get('leave-types/create', fn (): RedirectResponse => to_route('admin.leave-types.index'));
        Route::get('leave-types/{leaveType}/edit', fn (): RedirectResponse => to_route('admin.leave-types.index'))->whereNumber('leaveType');
        Route::resource('leave-types', LeaveTypeController::class)->except(['show', 'create', 'edit']);
        Route::get('leave-requests', [LeaveRequestController::class, 'reviewIndex'])->name('leave-requests.index');
        Route::post('leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('leave-requests.approve');
        Route::post('leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('leave-requests.reject');
    });
});

require __DIR__.'/settings.php';
