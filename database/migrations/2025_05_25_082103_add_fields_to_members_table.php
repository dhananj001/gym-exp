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
            $table->string('phone')->nullable()->after('email');
            $table->date('birthdate')->nullable()->after('phone');
            $table->integer('age')->nullable()->after('birthdate');
            $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('age');
            $table->text('address')->nullable()->after('gender');
            $table->decimal('membership_fee', 8, 2)->after('expiry_date');
            $table->enum('payment_status', ['paid', 'partial', 'unpaid'])->after('membership_fee');
            $table->enum('payment_method', ['cash', 'card', 'upi', 'netbanking'])->nullable()->after('payment_status');
            $table->enum('workout_time_slot', ['6am-8am', '8am-10am', '10am-12pm', '4pm-6pm', '6pm-8pm'])->nullable()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'birthdate',
                'age',
                'gender',
                'address',
                'membership_fee',
                'payment_status',
                'payment_method',
                'workout_time_slot',
            ]);
        });
    }
};
