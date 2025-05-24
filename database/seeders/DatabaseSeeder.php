<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Trainer;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();


        Trainer::create(['name' => 'Dhananjay Borse']);
        Trainer::create(['name' => 'Abhishek Jaiswal']);
        Trainer::create(['name' => 'Gaurav Sir']);
    }
}
