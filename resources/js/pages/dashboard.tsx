import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  XCircle,
  DollarSign,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../components/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
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
}

interface Analytics {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  totalRevenue: string;
  recentMembers: Member[];
  monthlyTrend: { [month: string]: number };
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Line chart data for monthly trend
  const monthlyTrendData = {
    labels: Object.keys(analytics.monthlyTrend),
    datasets: [
      {
        label: 'New Members',
        data: Object.values(analytics.monthlyTrend),
        borderColor: '#2563EB', // blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Chart options with theme support
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
      },
      title: {
        display: true,
        text: 'Monthly New Members Trend',
        color: theme === 'dark' ? '#D1D5DB' : '#374151',
        font: { size: 16, weight: 'bold' },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB' },
      },
      y: {
        ticks: { color: theme === 'dark' ? '#D1D5DB' : '#374151' },
        grid: { color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB' },
      },
    },
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Flash Messages */}
        {flash?.success && (
          <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">{flash.success}</AlertDescription>
          </Alert>
        )}
        {flash?.error && (
          <Alert className="bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="text-red-800 dark:text-red-200">{flash.error}</AlertDescription>
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
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Members
                </CardTitle>
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.totalMembers}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Members
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.activeMembers}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Expired Members
                </CardTitle>
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.expiredMembers}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ₹{analytics.totalRevenue}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Members Table */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Recent Members</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="text-gray-900 dark:text-gray-100">ID</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Membership</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Start Date</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100">Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 dark:text-gray-400">
                        No recent members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    analytics.recentMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <TableCell className="text-gray-900 dark:text-gray-100">{member.id}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                            {member.membership_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{member.start_date}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{member.expiry_date}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Monthly New Members Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
            //   <div className="h-[300px]">
                <Line data={monthlyTrendData} options={chartOptions}height={100} />
            //   </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
