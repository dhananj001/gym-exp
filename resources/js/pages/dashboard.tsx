import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  XCircle,
  DollarSign,
  Wallet,
  TrendingUp,
} from 'lucide-react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { useTheme } from '../components/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import StatCard from '@/components/ui/StatCard';
import ChartCard from '@/components/ui/ChartCard';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

interface Member {
  id: number;
  name: string;
  membership_type: string;
  start_date: string;
  expiry_date: string;
  payment_status: string;
}

interface Analytics {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  totalRevenue: string;
  recentMembers: Member[];
  monthlyTrend: { [month: string]: number };
  revenueTrend: { [month: string]: number };
  membershipTypes: { [type: string]: number };
  paymentStatuses: { [status: string]: number };
}

interface PageProps {
  analytics: Analytics;
  flash?: {
    success?: string;
    error?: string;
  };
}

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
  const { props } = usePage<PageProps>();
  const { analytics, flash } = props;
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Chart options with neutral theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: theme === 'dark' ? '#E4E4E7' : '#4B5563', font: { size: 14 } },
      },
      title: {
        display: true,
        color: theme === 'dark' ? '#E4E4E7' : '#4B5563',
        font: { size: 16, weight: '600' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: { color: theme === 'dark' ? '#E4E4E7' : '#4B5563' },
        grid: { color: theme === 'dark' ? 'rgba(228,228,231,0.1)' : '#F3F4F6' },
      },
      y: {
        ticks: { color: theme === 'dark' ? '#E4E4E7' : '#4B5563' },
        grid: { color: theme === 'dark' ? 'rgba(228,228,231,0.1)' : '#F3F4F6' },
      },
    },
  };

  // Monthly New Members Trend (Line Chart)
  const monthlyTrendData = {
    labels: Object.keys(analytics.monthlyTrend),
    datasets: [
      {
        label: 'New Members',
        data: Object.values(analytics.monthlyTrend),
        borderColor: '#60A5FA', // blue-400
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Monthly Revenue Trend (Line Chart)
  const revenueTrendData = {
    labels: Object.keys(analytics.revenueTrend),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: Object.values(analytics.revenueTrend),
        borderColor: '#34D399', // emerald-400
        backgroundColor: 'rgba(52, 211, 153, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Membership Type Distribution (Pie Chart)
  const membershipTypeData = {
    labels: Object.keys(analytics.membershipTypes),
    datasets: [
      {
        label: 'Membership Types',
        data: Object.values(analytics.membershipTypes),
        backgroundColor: ['#93C5FD', '#6EE7B7', '#FBBF24', '#FCA5A5', '#C4B5FD'], // blue-300, emerald-300, yellow-300, red-300, violet-300
        borderColor: ['#93C5FD', '#6EE7B7', '#FBBF24', '#FCA5A5', '#C4B5FD'],
        borderWidth: 1,
      },
    ],
  };

  // Payment Status Distribution (Bar Chart)
  const paymentStatusData = {
    labels: Object.keys(analytics.paymentStatuses),
    datasets: [
      {
        label: 'Members',
        data: Object.values(analytics.paymentStatuses),
        backgroundColor: ['#6EE7B7', '#FBBF24', '#FCA5A5'], // emerald-300, yellow-300, red-300
        borderColor: ['#6EE7B7', '#FBBF24', '#FCA5A5'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        {/* <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-700 dark:text-zinc-200">Gym Dashboard</h1>
          <ThemeToggle />
        </div> */}

        {/* Flash Messages */}
        {flash?.success && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 animate-in fade-in">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">{flash.success}</AlertDescription>
          </Alert>
        )}
        {flash?.error && (
          <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 animate-in fade-in">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">{flash.error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Members"
              value={analytics.totalMembers}
              icon={<Users className="h-5 w-5" />}
              colorClass="text-blue-400 dark:text-blue-300"
            />
            <StatCard
              title="Active Members"
              value={analytics.activeMembers}
              icon={<CheckCircle2 className="h-5 w-5" />}
              colorClass="text-green-400 dark:text-green-300"
            />
            <StatCard
              title="Expired Members"
              value={analytics.expiredMembers}
              icon={<XCircle className="h-5 w-5" />}
              colorClass="text-red-400 dark:text-red-300"
            />
            <StatCard
              title="Total Revenue"
              value={`₹${analytics.totalRevenue}`}
              icon={<DollarSign className="h-5 w-5" />}
              colorClass="text-yellow-400 dark:text-yellow-300"
            />
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard title="Monthly New Members Trend" isLoading={isLoading}>
            <Line
              data={monthlyTrendData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'New Members' } } }}
            />
          </ChartCard>
          <ChartCard title="Monthly Revenue Trend" isLoading={isLoading}>
            <Line
              data={revenueTrendData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Revenue (₹)' } } }}
            />
          </ChartCard>
          <ChartCard title="Membership Type Distribution" isLoading={isLoading}>
            <Pie
              data={membershipTypeData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Membership Types' } } }}
            />
          </ChartCard>
          <ChartCard title="Payment Status Distribution" isLoading={isLoading}>
            <Bar
              data={paymentStatusData}
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: 'Payment Status' } } }}
            />
          </ChartCard>
        </div>

        {/* Recent Members Table */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-zinc-200">Recent Members</h2>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-zinc-800">
                    <TableHead className="text-gray-600 dark:text-zinc-300">ID</TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300">Name</TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300">Membership</TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300">Start Date</TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300">Expiry Date</TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 dark:text-zinc-400">
                        No recent members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics.recentMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        <TableCell className="text-gray-700 dark:text-zinc-200">{member.id}</TableCell>
                        <TableCell className="text-gray-700 dark:text-zinc-200">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300">
                            {member.membership_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-zinc-200">{member.start_date}</TableCell>
                        <TableCell className="text-gray-700 dark:text-zinc-200">{member.expiry_date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={
                              member.payment_status === 'Paid'
                                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                : member.payment_status === 'Partial'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            }
                          >
                            {member.payment_status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
