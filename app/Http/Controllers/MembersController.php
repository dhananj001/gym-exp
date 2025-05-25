<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class MembersController extends Controller
{

    /**
     * Display the Dashboard page with analytics data.
     */
    public function dashboard()
    {
        $today = Carbon::today();

        // Monthly trend: New members per month for the current year
        $monthlyTrend = Member::selectRaw('MONTHNAME(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $today->year)
            ->groupBy('month')
            ->orderByRaw('MONTH(created_at)')
            ->pluck('count', 'month')
            ->mapWithKeys(function ($count, $month) {
                return [substr($month, 0, 3) => $count];
            })
            ->toArray();
        $allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $monthlyTrend = array_merge(array_fill_keys($allMonths, 0), $monthlyTrend);

        // Monthly revenue trend: Sum of membership_fee for paid members
        $revenueTrend = Member::selectRaw('MONTHNAME(created_at) as month, SUM(membership_fee) as total')
            ->where('payment_status', 'paid')
            ->whereYear('created_at', $today->year)
            ->groupBy('month')
            ->orderByRaw('MONTH(created_at)')
            ->pluck('total', 'month')
            ->mapWithKeys(function ($total, $month) {
                return [substr($month, 0, 3) => round((float)$total, 2)];
            })
            ->toArray();
        $revenueTrend = array_merge(array_fill_keys($allMonths, 0), $revenueTrend);

        return Inertia::render('Dashboard', [
            'analytics' => [
                'totalMembers' => Member::count(),
                'activeMembers' => Member::where('expiry_date', '>', $today)->count(),
                'expiredMembers' => Member::where('expiry_date', '<=', $today)->count(),
                'totalRevenue' => number_format(Member::where('payment_status', 'paid')->sum('membership_fee'), 2),
                'membershipTypes' => Member::groupBy('membership_type')
                    ->selectRaw('membership_type, COUNT(*) as count')
                    ->pluck('count', 'membership_type')
                    ->mapWithKeys(function ($count, $type) {
                        return [match ($type) {
                            '1_month' => '1 Month',
                            '3_months' => '3 Months',
                            '6_months' => '6 Months',
                            '1_year' => '1 Year',
                            'custom' => 'Custom',
                            default => $type
                        } => $count];
                    })
                    ->toArray(),
                'paymentStatuses' => Member::groupBy('payment_status')
                    ->selectRaw('payment_status, COUNT(*) as count')
                    ->pluck('count', 'payment_status')
                    ->mapWithKeys(function ($count, $status) {
                        return [ucfirst($status) => $count];
                    })
                    ->toArray(),
                'recentMembers' => Member::orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(['id', 'name', 'membership_type', 'start_date', 'expiry_date', 'payment_status'])
                    ->map(function ($member) {
                        $member->membership_type = match ($member->membership_type) {
                            '1_month' => '1 Month',
                            '3_months' => '3 Months',
                            '6_months' => '6 Months',
                            '1_year' => '1 Year',
                            'custom' => 'Custom',
                            default => $member->membership_type,
                        };
                        return $member;
                    }),
                'monthlyTrend' => $monthlyTrend,
                'revenueTrend' => $revenueTrend,
            ],
            'flash' => session('flash', []),
        ]);
    }


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
     * Validates input, calculates age, auto-calculates expiry date for non-custom types, and redirects.
     */
    public function store(Request $request)
    {
        Log::info('Store request:', $request->all()); // Debug request
        // Validate input data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:members,email',
            'phone' => 'nullable|string|max:15',
            'birthdate' => 'nullable|date',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string|max:500',
            'membership_type' => 'required|in:1_month,3_months,6_months,1_year,custom',
            'start_date' => 'required|date',
            'expiry_date' => 'required_if:membership_type,custom|date|after_or_equal:start_date',
            'membership_fee' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,partial,unpaid',
            'payment_method' => 'nullable|in:cash,card,upi,netbanking',
            'workout_time_slot' => 'nullable|in:Morning,Evening',
        ]);

        // If validation fails, redirect back with errors and input
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get all request data
        $data = $request->all();

        // Calculate age if birthdate is provided
        if (!empty($data['birthdate'])) {
            $birthDate = Carbon::parse($data['birthdate']);
            $today = Carbon::today();
            $age = $today->diffInYears($birthDate);
            $data['age'] = $age;
        } else {
            $data['age'] = null;
        }

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

        // Create the member record
        Member::create($data);

        // Redirect to the Members page with a success message
        return redirect()->route('members')->with('flash', ['success' => 'Member added successfully']);
    }

    /**
     * Update an existing member's details.
     * Validates input, calculates age, auto-calculates expiry date for non-custom types, and redirects.
     */
    public function update(Request $request, Member $member)
    {
        Log::info('Update request:', $request->all()); // Debug request
        // Validate input data, allowing the same email for the current member
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:members,email,' . $member->id,
            'phone' => 'nullable|string|max:15',
            'birthdate' => 'nullable|date',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string|max:500',
            'membership_type' => 'required|in:1_month,3_months,6_months,1_year,custom',
            'start_date' => 'required|date',
            'expiry_date' => 'required_if:membership_type,custom|date|after_or_equal:start_date',
            'membership_fee' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,partial,unpaid',
            'payment_method' => 'nullable|in:cash,card,upi,netbanking',
            'workout_time_slot' => 'nullable|in:Morning,Evening',
        ]);

        // If validation fails, redirect back with errors and input
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Get all request data
        $data = $request->all();

        // Calculate age if birthdate is provided
        if (!empty($data['birthdate'])) {
            $birthDate = Carbon::parse($data['birthdate']);
            $today = Carbon::today();
            $age = $today->diffInYears($birthDate);
            $data['age'] = $age;
        } else {
            $data['age'] = null;
        }

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

        // Update the member record
        $member->update($data);

        // Redirect to the Members page with a success message
        return redirect()->route('members')->with('flash', ['success' => 'Member updated successfully']);
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
        return redirect()->route('members')->with('flash', ['success' => 'Member deleted successfully']);
    }
}
