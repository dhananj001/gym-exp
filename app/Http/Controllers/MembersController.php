<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Models\Member;
use App\Models\Trainer;
use Inertia\Inertia;
use Carbon\Carbon;

class MembersController extends Controller
{
    /**
     * Display the Members page with a list of all members and trainers.
     */
    public function index()
    {
        return Inertia::render('Members', [
            'members' => Member::with('trainer')->get()->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'gender' => $member->gender,
                    'dob' => $member->dob,
                    'contact_number' => $member->contact_number,
                    'address' => $member->address,
                    'membership_plan' => $member->membership_plan,
                    'membership_type' => $member->membership_type,
                    'trainer_id' => $member->trainer_id,
                    'trainer_name' => $member->trainer?->name,
                    'start_date' => $member->start_date,
                    'expiry_date' => $member->expiry_date,
                    'payable_amount' => $member->payable_amount,
                    'payment_mode' => $member->payment_mode,
                    'payment_status' => $member->payment_status,
                ];
            }),
            'trainers' => Trainer::all()->map(function ($trainer) {
                return ['id' => $trainer->id, 'name' => $trainer->name];
            }),
            'flash' => session('flash', []),
        ]);
    }

    /**
     * Store a new member in the database.
     */
    public function store(StoreMemberRequest $request)
    {
        $data = $request->validated();

        // Auto-calculate expiry date for non-custom membership types
        if ($data['membership_type'] !== 'custom') {
            $startDate = Carbon::parse($data['start_date']);
            $data['expiry_date'] = match ($data['membership_type']) {
                '1_month' => $startDate->copy()->addMonth(),
                '3_months' => $startDate->copy()->addMonths(3),
                '6_months' => $startDate->copy()->addMonths(6),
                '1_year' => $startDate->copy()->addYear(),
                default => $data['expiry_date'],
            };
        }

        // Calculate payable amount
        $months = match ($data['membership_type']) {
            '1_month' => 1,
            '3_months' => 3,
            '6_months' => 6,
            '1_year' => 12,
            'custom' => Carbon::parse($data['expiry_date'])->diffInMonths(Carbon::parse($data['start_date'])) ?: 1,
        };
        $basePrice = $data['membership_plan'] === 'cardio' ? 50 : 75;
        $data['payable_amount'] = $basePrice * $months;

        Member::create($data);

        return redirect()->route('members')->with('flash.success', 'Member added successfully');
    }

    /**
     * Update an existing member's details.
     */
    public function update(UpdateMemberRequest $request, Member $member)
    {
        $data = $request->validated();

        // Auto-calculate expiry date for non-custom membership types
        if ($data['membership_type'] !== 'custom') {
            $startDate = Carbon::parse($data['start_date']);
            $data['expiry_date'] = match ($data['membership_type']) {
                '1_month' => $startDate->copy()->addMonth(),
                '3_months' => $startDate->copy()->addMonths(3),
                '6_months' => $startDate->copy()->addMonths(6),
                '1_year' => $startDate->copy()->addYear(),
                default => $data['expiry_date'],
            };
        }

        // Calculate payable amount
        $months = match ($data['membership_type']) {
            '1_month' => 1,
            '3_months' => 3,
            '6_months' => 6,
            '1_year' => 12,
            'custom' => Carbon::parse($data['expiry_date'])->diffInMonths(Carbon::parse($data['start_date'])) ?: 1,
        };
        $basePrice = $data['membership_plan'] === 'cardio' ? 50 : 75;
        $data['payable_amount'] = $basePrice * $months;

        $member->update($data);

        return redirect()->route('members')->with('flash.success', 'Member updated successfully');
    }

    /**
     * Delete a member from the database.
     */
    public function destroy(Member $member)
    {
        $member->delete();

        return redirect()->route('members')->with('flash.success', 'Member deleted successfully');
    }
}
