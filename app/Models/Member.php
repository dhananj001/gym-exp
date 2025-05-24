<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'gender',
        'dob',
        'contact_number',
        'address',
        'membership_plan',
        'membership_type',
        'trainer_id',
        'start_date',
        'expiry_date',
        'payable_amount',
        'payment_mode',
        'payment_status',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
