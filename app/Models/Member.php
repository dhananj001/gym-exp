<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'birthdate',
        'age',
        'gender',
        'address',
        'membership_type',
        'start_date',
        'expiry_date',
        'membership_fee',
        'payment_status',
        'payment_method',
        'workout_time_slot',
    ];
}
