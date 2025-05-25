<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use Faker\Provider\en_IN\Person;
use Faker\Provider\en_IN\Address;
use Faker\Provider\en_IN\PhoneNumber;

class MemberFactory extends Factory
{
    protected $model = Member::class;

    public function definition(): array
    {
        // Add Indian-specific providers
        $this->faker->addProvider(new Person($this->faker));
        $this->faker->addProvider(new Address($this->faker));
        $this->faker->addProvider(new PhoneNumber($this->faker));

        // Generate random birthdate (18–70 years old)
        $birthdate = $this->faker->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d');
        $today = Carbon::today();
        $age = $today->diffInYears(Carbon::parse($birthdate));

        // Random start date within the last year or next 30 days
        $startDate = $this->faker->dateTimeBetween('-1 year', '+30 days')->format('Y-m-d');

        // Membership type and corresponding expiry date
        $membershipType = $this->faker->randomElement(['1_month', '3_months', '6_months', '1_year', 'custom']);
        $start = Carbon::parse($startDate);
        $expiryDate = match ($membershipType) {
            '1_month' => $start->copy()->addMonth(),
            '3_months' => $start->copy()->addMonths(3),
            '6_months' => $start->copy()->addMonths(6),
            '1_year' => $start->copy()->addYear(),
            'custom' => $start->copy()->addDays($this->faker->numberBetween(15, 365)),
        };

        // Membership fee based on type
        $membershipFee = match ($membershipType) {
            '1_month' => $this->faker->numberBetween(1000, 3000),
            '3_months' => $this->faker->numberBetween(2500, 7000),
            '6_months' => $this->faker->numberBetween(5000, 12000),
            '1_year' => $this->faker->numberBetween(10000, 20000),
            'custom' => $this->faker->numberBetween(2000, 15000),
        };

        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'phone' => $this->faker->mobileNumber,
            'birthdate' => $birthdate,
            'age' => $age,
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'address' => $this->faker->address,
            'membership_type' => $membershipType,
            'start_date' => $startDate,
            'expiry_date' => $expiryDate->format('Y-m-d'),
            'membership_fee' => $membershipFee,
            'payment_status' => $this->faker->randomElement(['paid', 'partial', 'unpaid']),
            'payment_method' => $this->faker->randomElement(['cash', 'card', 'upi', 'netbanking']),
            'workout_time_slot' => $this->faker->randomElement(['Morning', 'Evening']),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'updated_at' => now(),
        ];
    }
}
