<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Calculate metrics
        $totalMembers = Member::count();
        $activeMembers = Member::where('expiry_date', '>', $today)->count();
        $expiredMembers = Member::where('expiry_date', '<=', $today)->count();
        $totalRevenue = Member::sum('membership_fee');

        // Fetch recent members (last 5)
        $recentMembers = Member::orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'phone' => $member->phone,
                    'membership_fee' => $member->membership_fee,
                    'created_at' => $member->created_at->toDateString(),
                ];
            });

        // Chart data: New members per month (last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::today()->subMonths($i);
            $count = Member::whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->count();
            $chartData[] = [
                'month' => $month->format('M Y'),
                'members' => $count,
            ];
        }

        return Inertia::render('Dashboard', [
            'metrics' => [
                'totalMembers' => $totalMembers,
                'activeMembers' => $activeMembers,
                'expiredMembers' => $expiredMembers,
                'totalRevenue' => $totalRevenue,
            ],
            'recentMembers' => $recentMembers,
            'chartData' => $chartData,
            'flash' => session('flash', []),
        ]);
    }
}
