
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search as SearchIcon, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Overview from '@/components/Overview';
import RecentSales from '@/components/RecentSales';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    membership_fee: string;
    created_at: string;
}

interface ChartDataPoint {
    month: string;
    members: number;
}

interface Metrics {
    totalMembers: number;
    activeMembers: number;
    expiredMembers: number;
    totalRevenue: number;
}

interface PageProps {
    metrics: Metrics;
    recentMembers: Member[];
    chartData: ChartDataPoint[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const Dashboard: React.FC<PageProps> = ({ metrics, recentMembers, chartData, flash }) => {
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex-col md:flex font-sans">
                {/* Top Navigation */}
                <div className="border-b bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
                        {/* Gym Branch */}
                        <Button variant="ghost" className="text-gray-700 dark:text-gray-200 font-semibold">
                            Gym Admin
                        </Button>
                        {/* Navigation */}
                        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            >
                                Overview
                            </Link>
                            <Link
                                href="/members"
                                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            >
                                Members
                            </Link>
                        </nav>
                        {/* Search and User */}
                        <div className="ml-auto flex items-center space-x-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    placeholder="Search members..."
                                    className="pl-8 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-48 rounded-md"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-gray-700 dark:text-gray-200">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
                                    <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-gray-700 dark:text-gray-200">Profile</DropdownMenuItem>
                                    <DropdownMenuItem className="text-gray-700 dark:text-gray-200">
                                        <Link href="/logout" method="post">Logout</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6 p-8 pt-6 bg-gray-50 dark:bg-gray-900 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Gym Dashboard</h2>
                        <div className="flex items-center space-x-2 relative">
                            <Button
                                variant="outline"
                                className="text-gray-700 dark:text-gray-200"
                                onClick={() => setShowDatePicker(!showDatePicker)}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {dateRange.from ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || 'Today'}` : 'Select Date Range'}
                            </Button>
                            {showDatePicker && (
                                <div className="absolute top-12 right-0 z-50 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
                                    <DayPicker
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        className="text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                            )}
                            <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                                Download Report
                            </Button>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <Alert className={cn("bg-green-50 border-green-200 animate-in fade-in dark:bg-green-900 dark:border-green-700")}>
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-gray-200">{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert className={cn("bg-red-50 border-red-200 animate-in fade-in dark:bg-red-900 dark:border-red-700")}>
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-gray-200">{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                            <TabsTrigger value="overview" className="text-gray-900 dark:text-gray-100">Overview</TabsTrigger>
                            <TabsTrigger value="analytics" disabled className="text-gray-900 dark:text-gray-100">Analytics</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-6">
                            {/* Metrics Cards */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Total Members
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.totalMembers}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">+{Math.round(metrics.totalMembers * 0.1)} from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Active Members
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.activeMembers}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">+{Math.round(metrics.activeMembers * 0.05)} from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Expired Memberships
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{metrics.expiredMembers}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">+{Math.round(metrics.expiredMembers * 0.1)} from last month</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Total Revenue
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{metrics.totalRevenue.toLocaleString()}</div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">+10.2% from last month</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Chart and Recent Members */}
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4 bg-white dark:bg-gray-800 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-gray-100">Membership Trends</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Overview chartData={chartData} />
                                    </CardContent>
                                </Card>
                                <Card className="col-span-3 bg-white dark:bg-gray-800 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-gray-100">Recent Sign-Ups</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-gray-400">
                                            {recentMembers.length} new members this month
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <RecentSales members={recentMembers} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
