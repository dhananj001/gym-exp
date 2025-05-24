<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class MembersController extends Controller
{
    /**
     * Display the Members page with a list of all members.
     * Passes member data and flash messages to the Members.tsx frontend.
     */
    public function index()
    {
        return Inertia::render('Members', [
            'members' => Member::all(), // Fetches all members from the database
            'flash' => session('flash', []), // Passes success/error messages from redirects
        ]);
    }

    /**
     * Store a new member in the database.
     * Validates input, auto-calculates expiry date for non-custom types, and redirects.
     */
    public function store(Request $request)
    {
        // Validate input data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'membership_type' => 'required|in:1_month,3_months,6_months,1_year,custom',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date|after:start_date',
        ]);

        // If validation fails, redirect back with errors and input
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get all request data
        $data = $request->all();

        // Auto-calculate expiry date for non-custom membership types
        if ($data['membership_type'] !== 'custom') {
            $startDate = Carbon::parse($data['start_date']);
            $data['expiry_date'] = match ($data['membership_type']) {
                '1_month' => $startDate->addMonth(),
                '3_months' => $startDate->addMonths(3),
                '6_months' => $startDate->addMonths(6),
                '1_year' => $startDate->addYear(),
                default => $data['expiry_date'],
            };
        }

        // Create the member record
        Member::create($data);

        // Redirect to the Members page with a success message
        return redirect()->route('members')->with('success', 'Member added successfully');
    }

    /**
     * Update an existing member's details.
     * Validates input, auto-calculates expiry date for non-custom types, and redirects.
     */
    public function update(Request $request, Member $member)
    {
        // Validate input data, allowing the same email for the current member
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email,' . $member->id,
            'membership_type' => 'required|in:1_month,3_months,6_months,1_year,custom',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date|after:start_date',
        ]);

        // If validation fails, redirect back with errors and input
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get all request data
        $data = $request->all();

        // Auto-calculate expiry date for non-custom membership types
        if ($data['membership_type'] !== 'custom') {
            $startDate = Carbon::parse($data['start_date']);
            $data['expiry_date'] = match ($data['membership_type']) {
                '1_month' => $startDate->addMonth(),
                '3_months' => $startDate->addMonths(3),
                '6_months' => $startDate->addMonths(6),
                '1_year' => $startDate->addYear(),
                default => $data['expiry_date'],
            };
        }

        // Update the member record
        $member->update($data);

        // Redirect to the Members page with a success message
        return redirect()->route('members')->with('success', 'Member updated successfully');
    }

    /**
     * Delete a member from the database.
     * Removes the member and redirects with a success message.
     */
    public function destroy(Member $member)
    {
        // Delete the member record
        $member->delete();

        // Redirect to the Members page with a success message
        return redirect()->route('members')->with('success', 'Member deleted successfully');
    }
}
