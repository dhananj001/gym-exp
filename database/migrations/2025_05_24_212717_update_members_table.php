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
        Schema::create('trainers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::table('members', function (Blueprint $table) {
            $table->string('gender')->nullable();
            $table->date('dob')->nullable();
            $table->string('contact_number')->nullable();
            $table->text('address')->nullable();
            $table->string('membership_plan')->nullable();
            $table->foreignId('trainer_id')->nullable()->constrained('trainers')->onDelete('set null');
            $table->decimal('payable_amount', 8, 2)->nullable();
            $table->string('payment_mode')->nullable();
            $table->string('payment_status')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'dob',
                'contact_number',
                'address',
                'membership_plan',
                'trainer_id',
                'payable_amount',
                'payment_mode',
                'payment_status',
            ]);
        });

        Schema::dropIfExists('trainers');
    }
};
