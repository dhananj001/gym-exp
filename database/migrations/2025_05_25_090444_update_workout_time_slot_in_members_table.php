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
        Schema::table('members', function (Blueprint $table) {
            Schema::table('members', function (Blueprint $table) {
            // Drop the existing enum column
            $table->dropColumn('workout_time_slot');
            // Add a new enum column with updated values
            $table->enum('workout_time_slot', ['Morning', 'Evening'])->nullable()->after('payment_method');
        });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            // Drop the updated enum column
            $table->dropColumn('workout_time_slot');
            // Revert to the previous enum values
            $table->enum('workout_time_slot', ['6am-8am', '8am-10am', '10am-12pm', '4pm-6pm', '6pm-8pm'])->nullable()->after('payment_method');
        });
    }
};
