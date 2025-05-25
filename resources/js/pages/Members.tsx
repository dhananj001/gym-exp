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

// Define interfaces for TypeScript type safety
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
    phone: '',
    membership_type: '1_month',
    start_date: new Date().toISOString().split('T')[0], // Default to today
    expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // 1 month from today
    birthdate: '',
    age: '',
    gender: '',
    address: '',
    membership_fee: '',
    payment_status: '',
    payment_method: '',
    workout_time_slot: '',
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
      phone: member.phone,
      membership_type: member.membership_type,
      start_date: member.start_date,
      expiry_date: member.expiry_date,
      birthdate: member.birthdate,
      age: member.age,
      gender: member.gender,
      address: member.address,
      membership_fee: member.membership_fee,
      payment_status: member.payment_status,
      payment_method: member.payment_method,
      workout_time_slot: member.workout_time_slot,
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
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              <MembershipForm
                data={data}
                setData={setData}
                errors={errors}
                handleSubmit={handleSubmit}
                setIsOpen={setIsAddDialogOpen}
                mode="add"
              />
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
                                      size="icon"
                                      className="mr-2"
                                      onClick={() => handleEdit(member)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="w-full lg:!max-w-5xl">
                                    <DialogHeader>
                                      <DialogTitle>Edit Member</DialogTitle>
                                    </DialogHeader>
                                    <MembershipForm
                                      data={data}
                                      setData={setData}
                                      errors={errors}
                                      handleSubmit={handleUpdate}
                                      setIsOpen={() => setEditMember(null)}
                                      mode="edit"
                                    />
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
