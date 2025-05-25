<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the Dashboard page with aggregated member data.
     */
    public function index()
    {
        // Total members
        $totalMembers = Member::count();

        // Active members (expiry date is in the future)
        $activeMembers = Member::where('expiry_date', '>', Carbon::today())->count();

        // Expired members (expiry date is in the past or today)
        $expiredMembers = Member::where('expiry_date', '<=', Carbon::today())->count();

        // Total revenue (sum of membership fees for paid members)
        $totalRevenue = Member::where('payment_status', 'paid')->sum('membership_fee');

        // Membership type distribution
        $membershipTypes = Member::groupBy('membership_type')
            ->selectRaw('membership_type, COUNT(*) as count')
            ->pluck('count', 'membership_type')
            ->toArray();

        // Recent members (last 5 members added)
        $recentMembers = Member::orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'activeMembers' => $activeMembers,
                'expiredMembers' => $expiredMembers,
                'totalRevenue' => number_format($totalRevenue, 2),
                'membershipTypes' => $membershipTypes,
            ],
            'recentMembers' => $recentMembers,
            'flash' => session('flash', []),
        ]);
    }
}
