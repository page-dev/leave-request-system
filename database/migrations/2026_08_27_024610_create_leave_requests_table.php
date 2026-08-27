<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
                       $table->id();

            // Employee who owns/submitted the request
            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            // Selected leave type
            $table->foreignId('leave_type_id')
                ->constrained()
                ->restrictOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            $table->text('reason');

            // pending | approved | rejected
            $table->string('status')->default('pending');

            // Administrator/Approver who reviewed the request
            $table->foreignId('reviewed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('reviewed_at')->nullable();

            // Useful particularly when rejecting a request
            $table->text('review_note')->nullable();

            $table->timestamps();

            // Useful for common filtering
            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
