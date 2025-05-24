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
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members', href: '/members' },
];

const Members: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { members, flash } = props;

    const { data, setData, post, put, delete: deleteRequest, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        membership_type: '1_month',
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    });

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [editMember, setEditMember] = useState<Member | null>(null);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 500);
    }, []);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/members', {
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

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

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMember) {
            put(`/api/members/${editMember.id}`, {
                preserveState: true,
                onSuccess: () => {
                    setEditMember(null);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        deleteRequest(`/api/members/${id}`, {
            preserveState: true,
        });
    };

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
                <h1 className="text-3xl font-bold text-gray-900">Gym Members Management</h1>

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

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Add New Member</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                        onValueChange={(value) =>
                                            setData('membership_type', value as FormData['membership_type'])
                                        }
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
                                    {errors.membership_type && (
                                        <p className="text-red-500 text-sm mt-1">{errors.membership_type}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <Input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="mt-1"
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                                    )}
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
                                    {errors.expiry_date && (
                                        <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
                                    )}
                                </div>
                            </div>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                                Add Member
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
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

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Members List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No members found.</p>
                                <p className="text-sm text-gray-400">Add a member to get started!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
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
                                                    <Dialog open={editMember?.id === member.id} onOpenChange={(open) => !open && setEditMember(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(member)}>
                                                                Edit
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
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm">
                                                                Delete
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
