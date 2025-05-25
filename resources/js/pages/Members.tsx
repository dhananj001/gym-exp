import React, { useState, useEffect } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, AlertCircle, CheckCircle2, Plus, Pencil, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define interfaces for TypeScript type safety
interface Member {
    id: number;
    name: string;
    email: string;
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    start_date: string;
    expiry_date: string;
}

interface FormData {
    name: string;
    email: string;
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    start_date: string;
    expiry_date: string;
}

interface PageProps {
    members: Member[];
    flash?: {
        success?: string;
        error?: string;
    };
}

// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members', href: '/members' },
];

const Members: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { members, flash } = props;

    // Form state for adding/editing members
    const { data, setData, post, put, delete: deleteRequest, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        membership_type: '1_month',
        start_date: new Date().toISOString().split('T')[0], // Default to today
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // 1 month from today
    });

    // State for search, filter, loading, and editing
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // Control Add Member dialog

    // Simulate loading for better UX
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 400);
    }, []);

    // Remove artificial loading delay to minimize layout shift
    // useEffect(() => {
    //     setIsLoading(false); // Immediately show data since members are passed via props
    // }, []);

    // Auto-calculate expiry date when membership type or start date changes
    useEffect(() => {
        if (data.membership_type !== 'custom') {
            const startDate = new Date(data.start_date);
            let expiryDate: Date;

            switch (data.membership_type) {
                case '1_month':
                    expiryDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
                    break;
                case '3_months':
                    expiryDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
                    break;
                case '6_months':
                    expiryDate = new Date(startDate.setMonth(startDate.getMonth() + 6));
                    break;
                case '1_year':
                    expiryDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
                    break;
                default:
                    return;
            }

            setData('expiry_date', expiryDate.toISOString().split('T')[0]);
        }
    }, [data.membership_type, data.start_date]);

    // Handle adding a new member
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/members', {
            preserveState: true,
            onSuccess: () => {
                reset(); // Clear form
                setIsAddDialogOpen(false); // Close dialog
            },
        });
    };

    // Handle editing a member
    const handleEdit = (member: Member) => {
        setEditMember(member);
        setData({
            name: member.name,
            email: member.email,
            membership_type: member.membership_type,
            start_date: member.start_date,
            expiry_date: member.expiry_date,
        });
    };

    // Handle updating a member
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMember) {
            put(`/api/members/${editMember.id}`, {
                preserveState: true,
                onSuccess: () => {
                    setEditMember(null); // Close edit dialog
                    reset();
                },
            });
        }
    };

    // Handle deleting a member
    const handleDelete = (id: number) => {
        deleteRequest(`/api/members/${id}`, {
            preserveState: true,
        });
    };

    // Filter and search members
    const filteredMembers = members
        .filter((member) =>
            `${member.name} ${member.email}`.toLowerCase().includes(search.toLowerCase())
        )
        .filter((member) => {
            if (filter === 'active') return new Date(member.expiry_date) > new Date();
            if (filter === 'expired') return new Date(member.expiry_date) <= new Date();
            return true;
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-900">Gym Members Management</h1>

                {/* Flash Messages for Success/Error Feedback */}
                {flash?.success && (
                    <Alert className={cn("bg-green-50 border-green-200 animate-in fade-in")}>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert className={cn("bg-red-50 border-red-200 animate-in fade-in")}>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Sticky Action Bar with Add Button and Search/Filter */}
                <div className="sticky top-0 z-10 bg-white shadow-sm p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full lg:!max-w-5xl">
                            <DialogHeader>
                                <DialogTitle>Add New Member</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            placeholder="john@example.com"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData("phone", e.target.value)}
                                            placeholder="9876543210"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Membership Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                                        <select
                                            value={data.membership_type}
                                            onChange={(e) => setData("membership_type", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        >
                                            <option value="" disabled>
                                                Select type
                                            </option>
                                            <option value="1_month">1 Month</option>
                                            <option value="3_months">3 Months</option>
                                            <option value="6_months">6 Months</option>
                                            <option value="1_year">1 Year</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        {errors.membership_type && (
                                            <p className="text-red-600 text-xs mt-1">{errors.membership_type}</p>
                                        )}
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData("start_date", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.start_date && (
                                            <p className="text-red-600 text-xs mt-1">{errors.start_date}</p>
                                        )}
                                    </div>

                                    {/* Expiry Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input
                                            type="date"
                                            value={data.expiry_date}
                                            onChange={(e) => setData("expiry_date", e.target.value)}
                                            disabled={data.membership_type !== "custom"}
                                            className={`w-full rounded-md border px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out ${data.membership_type !== "custom"
                                                    ? "bg-gray-100 cursor-not-allowed border-gray-300"
                                                    : "border-gray-300"
                                                }`}
                                        />
                                        {errors.expiry_date && (
                                            <p className="text-red-600 text-xs mt-1">{errors.expiry_date}</p>
                                        )}
                                    </div>

                                    {/* Birthdate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                                        <input
                                            type="date"
                                            value={data.birthdate}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setData("birthdate", val);
                                                if (val) {
                                                    const birthDate = new Date(val);
                                                    const today = new Date();
                                                    let age = today.getFullYear() - birthDate.getFullYear();
                                                    const m = today.getMonth() - birthDate.getMonth();
                                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                        age--;
                                                    }
                                                    setData("age", age.toString());
                                                } else {
                                                    setData("age", "");
                                                }
                                            }}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.birthdate && <p className="text-red-600 text-xs mt-1">{errors.birthdate}</p>}
                                    </div>

                                    {/* Age (readonly) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                        <input
                                            type="text"
                                            value={data.age}
                                            readOnly
                                            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={data.gender}
                                            onChange={(e) => setData("gender", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        >
                                            <option value="" disabled>
                                                Select gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
                                    </div>

                                    {/* Address (full width) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <textarea
                                            rows={2}
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            placeholder="Enter full address"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                                    </div>

                                    {/* Membership Fee */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Membership Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={data.membership_fee}
                                            onChange={(e) => setData("membership_fee", e.target.value)}
                                            placeholder="5000"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        />
                                        {errors.membership_fee && <p className="text-red-600 text-xs mt-1">{errors.membership_fee}</p>}
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                                        <select
                                            value={data.payment_status}
                                            onChange={(e) => setData("payment_status", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        >
                                            <option value="" disabled>
                                                Select status
                                            </option>
                                            <option value="paid">Paid</option>
                                            <option value="partial">Partial</option>
                                            <option value="unpaid">Unpaid</option>
                                        </select>
                                        {errors.payment_status && <p className="text-red-600 text-xs mt-1">{errors.payment_status}</p>}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData("payment_method", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        >
                                            <option value="" disabled>
                                                Select method
                                            </option>
                                            <option value="cash">Cash</option>
                                            <option value="card">Card</option>
                                            <option value="upi">UPI</option>
                                            <option value="netbanking">Net Banking</option>
                                        </select>
                                        {errors.payment_method && <p className="text-red-600 text-xs mt-1">{errors.payment_method}</p>}
                                    </div>

                                    {/* Workout Time Slot */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Workout Time Slot</label>
                                        <select
                                            value={data.workout_time_slot}
                                            onChange={(e) => setData("workout_time_slot", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
          transition duration-150 ease-in-out"
                                        >
                                            <option value="" disabled>
                                                Select slot
                                            </option>
                                            <option value="6am-8am">6 AM - 8 AM</option>
                                            <option value="8am-10am">8 AM - 10 AM</option>
                                            <option value="10am-12pm">10 AM - 12 PM</option>
                                            <option value="4pm-6pm">4 PM - 6 PM</option>
                                            <option value="6pm-8pm">6 PM - 8 PM</option>
                                        </select>
                                        {errors.workout_time_slot && <p className="text-red-600 text-xs mt-1">{errors.workout_time_slot}</p>}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddDialogOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium
        text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold
        hover:bg-indigo-700 transition"
                                    >
                                        Add Member
                                    </button>
                                </div>
                            </form>




                        </DialogContent>
                    </Dialog>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-10"
                        />
                    </div>
                    <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Members List */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Members List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="w-[1000px] flex flex-col justify-center space-y-2 p-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="w-[1000px] flex flex-col justify-center text-center">
                                <p className="text-gray-500">No members found.</p>
                                <p className="text-sm text-gray-400">Add a member to get started!</p>
                            </div>
                        ) : (
                            <div className="w-[1000px] overflow-y-auto overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky top-0 bg-gray-50">Name</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Email</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Membership Type</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Start Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Expiry Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Status</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMembers.map((member) => (
                                            <TableRow key={member.id} className="hover:bg-gray-50">
                                                <TableCell>{member.name}</TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell>
                                                    {member.membership_type === '1_month' && '1 Month'}
                                                    {member.membership_type === '3_months' && '3 Months'}
                                                    {member.membership_type === '6_months' && '6 Months'}
                                                    {member.membership_type === '1_year' && '1 Year'}
                                                    {member.membership_type === 'custom' && 'Custom'}
                                                </TableCell>
                                                <TableCell>{member.start_date}</TableCell>
                                                <TableCell>{member.expiry_date}</TableCell>
                                                <TableCell>
                                                    {new Date(member.expiry_date) > new Date() ? (
                                                        <span className="text-green-600 font-medium">Active</span>
                                                    ) : (
                                                        <span className="text-red-600 font-medium">Expired</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {/* Edit Button with Pencil Icon */}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Dialog open={editMember?.id === member.id} onOpenChange={(open) => !open && setEditMember(null)}>
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon" // Smaller button for icon-only
                                                                            className="mr-2"
                                                                            onClick={() => handleEdit(member)}
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Edit Member</DialogTitle>
                                                                        </DialogHeader>
                                                                        <form onSubmit={handleUpdate} className="space-y-4">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                                                                    <Input
                                                                                        value={data.name}
                                                                                        onChange={(e) => setData('name', e.target.value)}
                                                                                        className="mt-1"
                                                                                        placeholder="John Doe"
                                                                                    />
                                                                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                                                    <Input
                                                                                        type="email"
                                                                                        value={data.email}
                                                                                        onChange={(e) => setData('email', e.target.value)}
                                                                                        className="mt-1"
                                                                                        placeholder="john@example.com"
                                                                                    />
                                                                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                                                                                    <Select
                                                                                        value={data.membership_type}
                                                                                        onValueChange={(value) => setData('membership_type', value as FormData['membership_type'])}
                                                                                    >
                                                                                        <SelectTrigger className="mt-1">
                                                                                            <SelectValue placeholder="Select type" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            <SelectItem value="1_month">1 Month</SelectItem>
                                                                                            <SelectItem value="3_months">3 Months</SelectItem>
                                                                                            <SelectItem value="6_months">6 Months</SelectItem>
                                                                                            <SelectItem value="1_year">1 Year</SelectItem>
                                                                                            <SelectItem value="custom">Custom</SelectItem>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                    {errors.membership_type && <p className="text-red-500 text-sm mt-1">{errors.membership_type}</p>}
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                                                                    <Input
                                                                                        type="date"
                                                                                        value={data.start_date}
                                                                                        onChange={(e) => setData('start_date', e.target.value)}
                                                                                        className="mt-1"
                                                                                    />
                                                                                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                                                                    <Input
                                                                                        type="date"
                                                                                        value={data.expiry_date}
                                                                                        onChange={(e) => setData('expiry_date', e.target.value)}
                                                                                        disabled={data.membership_type !== 'custom'}
                                                                                        className="mt-1"
                                                                                    />
                                                                                    {errors.expiry_date && <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex justify-end gap-2">
                                                                                <Button variant="outline" onClick={() => setEditMember(null)}>
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                                                                    Update
                                                                                </Button>
                                                                            </div>
                                                                        </form>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit Member</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    {/* Delete Button with Trash Icon */}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button className="bg-red-500 hover:bg-red-600" size="icon">
                                                                            <Trash className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This will permanently delete {member.name}'s record.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => handleDelete(member.id)}>
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Delete Member</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default Members;
