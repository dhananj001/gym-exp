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
            // Drop existing membership_type column
            $table->dropColumn('membership_type');
            // Add new enum column
            $table->enum('membership_type', ['1_month', '3_months', '6_months', '1_year', 'custom'])->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn('membership_type');
            $table->string('membership_type')->after('email');
        });
    }
};
