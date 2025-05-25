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
import MembershipForm from "../components/MembershipForm";
import MemberDetailsPopup from '../components/MemberDetailsPopup';

// Interfaces unchanged
interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    start_date: string;
    expiry_date: string;
    birthdate: string;
    age: string;
    gender: string;
    address: string;
    membership_fee: string;
    payment_status: string;
    payment_method: string;
    workout_time_slot: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    start_date: string;
    expiry_date: string;
    birthdate: string;
    age: string;
    gender: string;
    address: string;
    membership_fee: string;
    payment_status: string;
    payment_method: string;
    workout_time_slot: string;
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

    // Form for adding members
    const addForm = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        membership_type: '1_month',
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        birthdate: '',
        age: '',
        gender: '',
        address: '',
        membership_fee: '',
        payment_status: '',
        payment_method: '',
        workout_time_slot: '',
    });

    // Form for editing members
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [serverError, setServerError] = useState<string | null>(null); // New state for server errors
    const editForm = useForm<FormData>({
        name: '',
        email: '',
        phone: '',
        membership_type: '1_month',
        start_date: '',
        expiry_date: '',
        birthdate: '',
        age: '',
        gender: '',
        address: '',
        membership_fee: '',
        payment_status: '',
        payment_method: '',
        workout_time_slot: '',
    });

    // State for search, filter, loading, and popup
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // Simulate loading
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 400);
    }, []);

    // Auto-calculate expiry date for add form
    useEffect(() => {
        if (addForm.data.membership_type !== 'custom') {
            const startDate = new Date(addForm.data.start_date);
            let expiryDate: Date;
            switch (addForm.data.membership_type) {
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
            addForm.setData('expiry_date', expiryDate.toISOString().split('T')[0]);
        }
    }, [addForm.data.membership_type, addForm.data.start_date]);

    // Initialize edit form when editMember changes
    useEffect(() => {
        if (editMember) {
            editForm.reset();
            editForm.setData({
                name: editMember.name || '',
                email: editMember.email || '',
                phone: editMember.phone || '',
                membership_type: editMember.membership_type || '1_month',
                start_date: editMember.start_date || '',
                expiry_date: editMember.expiry_date || '',
                birthdate: editMember.birthdate || '',
                age: editMember.age || '',
                gender: editMember.gender || '',
                address: editMember.address || '',
                membership_fee: editMember.membership_fee || '',
                payment_status: editMember.payment_status || '',
                payment_method: editMember.payment_method || '',
                workout_time_slot: editMember.workout_time_slot || '',
            });
            setServerError(null); // Clear server error when opening edit form
        }
    }, [editMember]);

    // Handle adding a new member
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/members', {
            preserveState: true,
            onSuccess: () => {
                addForm.reset();
                setIsAddDialogOpen(false);
            },
            onError: (errors) => {
                console.log('Add errors:', errors);
                setServerError('Failed to add member. Please check the form.');
            },
        });
    };

    // Handle editing a member
    const handleEdit = (member: Member) => {
        setEditMember(member);
    };

    // Handle updating a member
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMember) {
            console.log('Submitting edit form with data:', editForm.data); // Debug payload
            editForm.put(`/members/${editMember.id}`, {
                preserveState: true,
                onSuccess: () => {
                    console.log('Update successful');
                    editForm.reset();
                    setEditMember(null);
                    setServerError(null);
                },
                onError: (errors) => {
                    console.log('Update errors:', errors);
                    setServerError('Failed to update member. Please check the form or try again.');
                },
            });
        }
    };

    // Handle deleting a member
    const handleDelete = (id: number) => {
        editForm.delete(`/members/${id}`, {
            preserveState: true,
        });
    };

    // Handle row click to open popup
    const handleRowClick = (member: Member, e: React.MouseEvent<HTMLTableRowElement>) => {
        if ((e.target as HTMLElement).closest('button')) return;
        setSelectedMember(member);
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Gym Members</h1>

                {flash?.success && (
                    <Alert className={cn("bg-green-50 border-green-200 animate-in fade-in dark:bg-green-900 dark:border-green-700")}>
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">{flash.success}</AlertDescription>
                    </Alert>
                )}
                {flash?.error && (
                    <Alert className={cn("bg-red-50 border-red-200 animate-in fade-in dark:bg-red-900 dark:border-red-700")}>
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-200">{flash.error}</AlertDescription>
                    </Alert>
                )}

                <div className="sticky top-0 z-10 lg:w-[1100px] bg-white dark:bg-gray-800 shadow-sm p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full lg:!max-w-2xl overflow-y-auto max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 dark:text-gray-100">Add New Member</DialogTitle>
                            </DialogHeader>
                            {serverError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{serverError}</AlertDescription>
                                </Alert>
                            )}
                            <MembershipForm
                                data={addForm.data}
                                setData={addForm.setData}
                                errors={addForm.errors}
                                handleSubmit={handleSubmit}
                                setIsOpen={setIsAddDialogOpen}
                                mode="add"
                            />
                        </DialogContent>
                    </Dialog>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-300" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600"
                        />
                    </div>
                    <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
                        <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Members List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="w-full flex flex-col justify-center space-y-2 p-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="w-full flex flex-col justify-center text-center">
                                <p className="text-gray-500 dark:text-gray-400">No members found.</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Add a member to get started!</p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 dark:bg-gray-700">
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Name</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Contact No</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Membership Type</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Start Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Expiry Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Status</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMembers.map((member) => (
                                            <TableRow
                                                key={member.id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                                onClick={(e) => handleRowClick(member, e)}
                                            >
                                                <TableCell className="text-gray-900 dark:text-gray-100">{member.name}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">{member.phone || 'N/A'}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {member.membership_type === '1_month' && '1 Month'}
                                                    {member.membership_type === '3_months' && '3 Months'}
                                                    {member.membership_type === '6_months' && '6 Months'}
                                                    {member.membership_type === '1_year' && '1 Year'}
                                                    {member.membership_type === 'custom' && 'Custom'}
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">{member.start_date}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">{member.expiry_date}</TableCell>
                                                <TableCell>
                                                    {new Date(member.expiry_date) > new Date() ? (
                                                        <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                                                    ) : (
                                                        <span className="text-red-600 dark:text-red-400 font-medium">Expired</span>
                                                    )}
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Dialog open={editMember?.id === member.id} onOpenChange={(open) => !open && setEditMember(null)}>
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="mr-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                                            onClick={() => handleEdit(member)}
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="w-full lg:!max-w-5xl overflow-y-auto max-h-[80vh]">
                                                                        <DialogHeader>
                                                                            <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Member</DialogTitle>
                                                                        </DialogHeader>
                                                                        {serverError && (
                                                                            <Alert variant="destructive" className="mb-4">
                                                                                <AlertCircle className="h-4 w-4" />
                                                                                <AlertDescription>{serverError}</AlertDescription>
                                                                            </Alert>
                                                                        )}
                                                                        <MembershipForm
                                                                            data={editForm.data}
                                                                            setData={editForm.setData}
                                                                            errors={editForm.errors}
                                                                            handleSubmit={handleUpdate}
                                                                            setIsOpen={() => setEditMember(null)}
                                                                            mode="edit"
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                                <p>Edit Member</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" size="icon">
                                                                            <Trash className="h-4 w-4" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Are you sure?</AlertDialogTitle>
                                                                            <AlertDialogDescription className="text-gray-700 dark:text-gray-200">
                                                                                This will permanently delete {member.name}'s record.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDelete(member.id)}
                                                                                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                                                            >
                                                                                Delete
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
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

                <MemberDetailsPopup
                    member={selectedMember}
                    isOpen={!!selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            </div>
        </AppLayout>
    );
};

export default Members;
