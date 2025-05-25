import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  Users,
  CheckCircle2,
  XCircle,
  DollarSign,
  Plus,
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
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip as UITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

import { toast } from 'sonner';

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

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
  const { theme } = useTheme();

  const analytics: Analytics = {
    totalMembers: 120,
    activeMembers: 95,
    expiredMembers: 25,
    totalRevenue: '₹125,000',
    recentMembers: [
      {
        id: 1,
        name: 'John Doe',
        membership_type: '1 Month',
        start_date: '2025-04-01',
        expiry_date: '2025-04-30',
      },
      {
        id: 2,
        name: 'Jane Smith',
        membership_type: '3 Months',
        start_date: '2025-03-15',
        expiry_date: '2025-06-14',
      },
    ],
    monthlyTrend: {
      Jan: 10,
      Feb: 15,
      Mar: 18,
      Apr: 20,
      May: 25,
      Jun: 22,
      Jul: 30,
      Aug: 28,
      Sep: 35,
      Oct: 40,
      Nov: 38,
      Dec: 45,
    },
  };

  const monthlyTrendData = {
    labels: Object.keys(analytics.monthlyTrend),
    datasets: [
      {
        label: 'New Members',
        data: Object.values(analytics.monthlyTrend),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

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

  const handleAddMember = () => {
    toast.success('New member added successfully!');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="px-6 py-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/avatar.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Members
              </CardTitle>
              <UITooltip>
                <TooltipTrigger>
                  <Users className="h-5 w-5 text-primary" />
                </TooltipTrigger>
                <TooltipContent>All registered members</TooltipContent>
              </UITooltip>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Active Members
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeMembers}</div>
              <Progress
                value={(analytics.activeMembers / analytics.totalMembers) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Expired Members
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.expiredMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Members + Add */}
        <div className="flex justify-between items-center">
          <CardTitle>Recent Members</CardTitle>
          <Dialog>
            <DialogTrigger className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Add Member
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>Enter member details here.</DialogDescription>
              <button
                onClick={handleAddMember}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Member
              </button>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.membership_type}</Badge>
                    </TableCell>
                    <TableCell>{member.start_date}</TableCell>
                    <TableCell>{member.expiry_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Tabs defaultValue="members" className="mt-8">
          <TabsList>
            <TabsTrigger value="members">New Members</TabsTrigger>
            <TabsTrigger value="revenue">Revenue (Coming Soon)</TabsTrigger>
          </TabsList>
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Monthly New Members Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={monthlyTrendData} options={chartOptions} height={100} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue">
            <Card>
              <CardContent className="text-muted-foreground">
                Revenue analytics will be available soon.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
