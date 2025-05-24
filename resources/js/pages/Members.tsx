import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { useForm as useReactHookForm } from 'react-hook-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Search, AlertCircle, CheckCircle2, Plus, Pencil, Trash, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Interfaces
interface Member {
    id: number;
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
    contact_number: string;
    address: string;
    membership_plan: 'cardio' | 'hardcore';
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    trainer_id: number | null;
    trainer_name?: string;
    start_date: string;
    expiry_date: string;
    payable_amount: number;
    payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer';
    payment_status: 'paid' | 'pending' | null;
}

interface Trainer {
    id: number;
    name: string;
}

interface FormData {
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    dob: string;
    contact_number: string;
    address: string;
    membership_plan: 'cardio' | 'hardcore';
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    trainer_id: number | null;
    start_date: string;
    expiry_date: string;
    payable_amount: number;
    payment_mode: 'cash' | 'card' | 'upi' | 'bank_transfer';
    payment_status: 'paid' | 'pending' | null;
}

interface PageProps {
    members: Member[];
    trainers: Trainer[];
    flash?: {
        success?: string;
        error?: string;
    };
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Members', href: '/members' },
];

// Sub-component: Member Form
interface MemberFormProps {
    initialData: FormData;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
    isEdit?: boolean;
    trainers: Trainer[];
}

const MemberForm: React.FC<MemberFormProps> = ({ initialData, onSubmit, onCancel, isEdit = false, trainers }) => {
    const form = useReactHookForm<FormData>({
        defaultValues: initialData,
        mode: 'onChange',
    });

    const { watch, setValue, handleSubmit, formState: { isValid, errors, isSubmitting }, reset } = form;

    // Debug form state
    console.log('Form state:', { isValid, errors, isSubmitting, values: watch() });

    const onFormSubmit = async (data: FormData) => {
        console.log('Form submitted with data:', data);
        try {
            await onSubmit(data);
            reset(); // Reset form on successful submission
        } catch (error) {
            console.error('Form submission error:', error);
            form.setError('root', { type: 'server', message: 'Failed to submit form. Please try again.' });
        }
    };

    // Auto-calculate age from DOB
    const dob = watch('dob');
    const age = useMemo(() => {
        if (!dob) return '';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    }, [dob]);

    // Auto-calculate expiry date
    const membershipType = watch('membership_type');
    const startDate = watch('start_date');
    useEffect(() => {
        if (membershipType !== 'custom' && startDate) {
            const start = new Date(startDate);
            let expiryDate: Date;
            switch (membershipType) {
                case '1_month':
                    expiryDate = new Date(start);
                    expiryDate.setMonth(start.getMonth() + 1);
                    break;
                case '3_months':
                    expiryDate = new Date(start);
                    expiryDate.setMonth(start.getMonth() + 3);
                    break;
                case '6_months':
                    expiryDate = new Date(start);
                    expiryDate.setMonth(start.getMonth() + 6);
                    break;
                case '1_year':
                    expiryDate = new Date(start);
                    expiryDate.setFullYear(start.getFullYear() + 1);
                    break;
                default:
                    return;
            }
            setValue('expiry_date', expiryDate.toISOString().split('T')[0], { shouldValidate: true });
        }
    }, [membershipType, startDate, setValue]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Display errors */}
                {form.formState.errors.root && (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                    </Alert>
                )}
                {Object.keys(errors).length > 0 && (
                    <Alert className="bg-red-50 border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>
                            {Object.entries(errors).map(([field, error]) => (
                                <div key={field}>{error.message || `Error in ${field}`}</div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}
                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">Personal Details</TabsTrigger>
                        <TabsTrigger value="membership">Membership Details</TabsTrigger>
                        <TabsTrigger value="payment">Payment Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <FormControl>
                                            <Input id="name" placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input id="email" type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                rules={{ required: 'Gender is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gender">Gender</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="gender">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dob"
                                rules={{ required: 'Date of Birth is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="dob">Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input id="dob" type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel htmlFor="age">Age</FormLabel>
                                <FormControl>
                                    <Input id="age" value={age} disabled />
                                </FormControl>
                            </FormItem>
                            <FormField
                                control={form.control}
                                name="contact_number"
                                rules={{
                                    required: 'Contact number is required',
                                    pattern: { value: /^\+?\d{10,15}$/, message: 'Invalid phone number (10-15 digits, optional +)' },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="contact_number">Contact Number</FormLabel>
                                        <FormControl>
                                            <Input id="contact_number" placeholder="+1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{ required: 'Address is required' }}
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel htmlFor="address">Address</FormLabel>
                                        <FormControl>
                                            <textarea
                                                id="address"
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                placeholder="123 Main St, City, Country"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="membership">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="membership_plan"
                                rules={{ required: 'Membership plan is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="membership_plan">Membership Plan</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="membership_plan">
                                                    <SelectValue placeholder="Select plan" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cardio">Cardio</SelectItem>
                                                <SelectItem value="hardcore">Hardcore</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="membership_type"
                                rules={{ required: 'Membership type is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="membership_type">Membership Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="membership_type">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1_month">1 Month</SelectItem>
                                                <SelectItem value="3_months">3 Months</SelectItem>
                                                <SelectItem value="6_months">6 Months</SelectItem>
                                                <SelectItem value="1_year">1 Year</SelectItem>
                                                <SelectItem value="custom">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="trainer_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="trainer_id">Trainer (Optional)</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === 'null' ? null : Number(value))}
                                            value={field.value?.toString() || 'null'}
                                        >
                                            <FormControl>
                                                <SelectTrigger id="trainer_id">
                                                    <SelectValue placeholder="Select trainer" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="null">None</SelectItem>
                                                {trainers.map((trainer) => (
                                                    <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                                        {trainer.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="start_date"
                                rules={{ required: 'Start date is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="start_date">Start Date</FormLabel>
                                        <FormControl>
                                            <Input id="start_date" type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expiry_date"
                                rules={{ required: 'Expiry date is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="expiry_date">Expiry Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="expiry_date"
                                                type="date"
                                                {...field}
                                                disabled={membershipType !== 'custom'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="payment">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="payable_amount"
                                rules={{ required: 'Payable amount is required', min: { value: 0, message: 'Amount must be non-negative' } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="payable_amount">Payable Amount ($)</FormLabel>
                                        <FormControl>
                                            <Input id="payable_amount" type="number" disabled {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payment_mode"
                                rules={{ required: 'Payment mode is required' }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="payment_mode">Payment Mode</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger id="payment_mode">
                                                    <SelectValue placeholder="Select mode" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="card">Card</SelectItem>
                                                <SelectItem value="upi">UPI</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payment_status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="payment_status">Payment Status</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value || null)}
                                            value={field.value || undefined}
                                        >
                                            <FormControl>
                                                <SelectTrigger id="payment_status">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSubmitting}
                        onClick={() => console.log('Add Member button clicked')}
                    >
                        {isEdit ? 'Update Member' : 'Add Member'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

// Sub-component: Member Details
interface MemberDetailsProps {
    member: Member;
    onEdit: () => void;
    onClose: () => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, onEdit, onClose }) => {
    console.log('MemberDetails rendering with member:', member);

    return (
        <div className="space-y-6">
            {member ? (
                <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">Personal Details</TabsTrigger>
                        <TabsTrigger value="membership">Membership Details</TabsTrigger>
                        <TabsTrigger value="payment">Payment Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value="personal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Name</p>
                                <p>{member.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Email</p>
                                <p>{member.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Gender</p>
                                <p>{member.gender ? (member.gender.charAt(0).toUpperCase() + member.gender.slice(1)) : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                                <p>{member.dob || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Age</p>
                                <p>
                                    {member.dob
                                        ? (() => {
                                              const birthDate = new Date(member.dob);
                                              const today = new Date();
                                              let age = today.getFullYear() - birthDate.getFullYear();
                                              const monthDiff = today.getMonth() - birthDate.getMonth();
                                              if (
                                                  monthDiff < 0 ||
                                                  (monthDiff === 0 && today.getDate() < birthDate.getDate())
                                              ) {
                                                  age--;
                                              }
                                              return age;
                                          })()
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Contact Number</p>
                                <p>{member.contact_number || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-gray-700">Address</p>
                                <p>{member.address || 'N/A'}</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="membership">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Membership Plan</p>
                                <p>{member.membership_plan ? (member.membership_plan.charAt(0).toUpperCase() + member.membership_plan.slice(1)) : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Membership Type</p>
                                <p>
                                    {member.membership_type === '1_month' ? '1 Month' :
                                     member.membership_type === '3_months' ? '3 Months' :
                                     member.membership_type === '6_months' ? '6 Months' :
                                     member.membership_type === '1_year' ? '1 Year' :
                                     member.membership_type === 'custom' ? 'Custom' : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Trainer</p>
                                <p>{member.trainer_name || 'None'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Start Date</p>
                                <p>{member.start_date || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Expiry Date</p>
                                <p>{member.expiry_date || 'N/A'}</p>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="payment">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Payable Amount</p>
                                <p>${member.payable_amount || '0'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Payment Mode</p>
                                <p>{member.payment_mode ? member.payment_mode.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Payment Status</p>
                                <p>{member.payment_status ? member.payment_status.toUpperCase() : 'N/A'}</p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            ) : (
                <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>No member data available.</AlertDescription>
                </Alert>
            )}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={onEdit}>
                    Edit
                </Button>
            </div>
        </div>
    );
};

// Main Component
const Members: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { members, trainers, flash } = props;

    // Form state
    const { data, setData, post, put, delete: deleteRequest, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        gender: 'male',
        dob: '',
        contact_number: '',
        address: '',
        membership_plan: 'cardio',
        membership_type: '1_month',
        trainer_id: null,
        start_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        payable_amount: 0,
        payment_mode: 'cash',
        payment_status: 'pending',
    });

    // State
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simulate loading
    useEffect(() => {
        setTimeout(() => setIsLoading(false), 400);
    }, []);

    // Filter and search members
    const filteredMembers = useMemo(() => {
        return members
            .filter((member) =>
                `${member.name} ${member.email}`.toLowerCase().includes(search.toLowerCase())
            )
            .filter((member) => {
                if (filter === 'active') return new Date(member.expiry_date) > new Date();
                if (filter === 'expired') return new Date(member.expiry_date) <= new Date();
                return true;
            });
    }, [members, search, filter]);

    // Handlers
    const handleAddSubmit = (formData: FormData) => {
        console.log('handleAddSubmit called with:', formData);
        setData(formData);
        console.log('Sending POST request with data:', formData);
        post('/api/members', {
            data: formData,
            preserveState: true,
            onSuccess: () => {
                console.log('Member added successfully');
                reset();
                setIsAddDialogOpen(false);
            },
            onError: (errors) => {
                console.log('Submission errors:', errors);
            },
        });
    };

    const handleEdit = (member: Member) => {
        console.log('Editing member:', member);
        setEditMember(member);
        setData({
            name: member.name || '',
            email: member.email || '',
            gender: member.gender || 'male',
            dob: member.dob || '',
            contact_number: member.contact_number || '',
            address: member.address || '',
            membership_plan: member.membership_plan || 'cardio',
            membership_type: member.membership_type || '1_month',
            trainer_id: member.trainer_id,
            start_date: member.start_date || new Date().toISOString().split('T')[0],
            expiry_date: member.expiry_date || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            payable_amount: member.payable_amount || 0,
            payment_mode: member.payment_mode || 'cash',
            payment_status: member.payment_status || 'pending',
        });
    };

    const handleUpdate = (formData: FormData) => {
        if (editMember) {
            console.log('Updating member:', formData);
            setData(formData);
            put(`/api/members/${editMember.id}`, {
                data: formData,
                preserveState: true,
                onSuccess: () => {
                    console.log('Member updated successfully');
                    setEditMember(null);
                    reset();
                },
                onError: (errors) => {
                    console.log('Update errors:', errors);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        console.log('Deleting member ID:', id);
        deleteRequest(`/api/members/${id}`, {
            preserveState: true,
            onSuccess: () => {
                console.log('Member deleted successfully');
            },
        });
    };

    const handleRowClick = (member: Member, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.actions-cell')) return;
        console.log('Row clicked, setting selectedMember:', member);
        setSelectedMember(member);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Gym Members Management</h1>

                {/* Flash Messages */}
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
                {/* Inertia.js errors */}
                {Object.keys(errors).length > 0 && (
                    <Alert className={cn("bg-red-50 border-red-200 animate-in fade-in")}>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>
                            {Object.values(errors).map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Action Bar */}
                <div className="sticky top-0 z-10 bg-white shadow-sm p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-center">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Add New Member</DialogTitle>
                                <DialogDescription>Fill in the details to add a new gym member.</DialogDescription>
                            </DialogHeader>
                            <MemberForm
                                initialData={data}
                                onSubmit={handleAddSubmit}
                                onCancel={() => setIsAddDialogOpen(false)}
                                trainers={trainers}
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
                            <div className="w-full flex flex-col justify-center space-y-2 p-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="w-full flex flex-col justify-center text-center">
                                <p className="text-gray-500">No members found.</p>
                                <p className="text-sm text-gray-400">Add a member to get started!</p>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="sticky top-0 bg-gray-50">Name</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Membership Type</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Start Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Expiry Date</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Status</TableHead>
                                            <TableHead className="sticky top-0 bg-gray-50">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMembers.map((member) => (
                                            <TableRow
                                                key={member.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={(e) => handleRowClick(member, e)}
                                            >
                                                <TableCell>{member.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {member.membership_type === '1_month' ? '1 Month' :
                                                     member.membership_type === '3_months' ? '3 Months' :
                                                     member.membership_type === '6_months' ? '6 Months' :
                                                     member.membership_type === '1_year' ? '1 Year' :
                                                     member.membership_type === 'custom' ? 'Custom' : 'N/A'}
                                                </TableCell>
                                                <TableCell>{member.start_date || 'N/A'}</TableCell>
                                                <TableCell>{member.expiry_date || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {new Date(member.expiry_date) > new Date() ? (
                                                        <span className="text-green-600 font-medium">Active</span>
                                                    ) : (
                                                        <span className="text-red-600 font-medium">Expired</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="actions-cell">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Dialog
                                                                    open={editMember?.id === member.id}
                                                                    onOpenChange={(open) => !open && setEditMember(null)}
                                                                >
                                                                    <DialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="mr-2"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEdit(member);
                                                                            }}
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-w-3xl">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Edit Member</DialogTitle>
                                                                            <DialogDescription>Update the details for {member.name}.</DialogDescription>
                                                                        </DialogHeader>
                                                                        <MemberForm
                                                                            initialData={data}
                                                                            onSubmit={handleUpdate}
                                                                            onCancel={() => setEditMember(null)}
                                                                            isEdit
                                                                            trainers={trainers}
                                                                        />
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit Member</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            className="bg-red-500 hover:bg-red-600"
                                                                            size="icon"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
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
                                                                            <AlertDialogAction
                                                                                onClick={() => handleDelete(member.id)}
                                                                            >
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

                {/* Member Details Dialog/Drawer */}
                {selectedMember && (
                    isMobile ? (
                        <Drawer open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
                            <DrawerContent aria-describedby="drawer-description">
                                <DrawerHeader>
                                    <DrawerTitle>{selectedMember.name || 'Member'}'s Details</DrawerTitle>
                                </DrawerHeader>
                                <div id="drawer-description" className="sr-only">
                                    View detailed information for {selectedMember.name || 'member'}.
                                </div>
                                <div className="p-6">
                                    <MemberDetails
                                        member={selectedMember}
                                        onEdit={() => {
                                            handleEdit(selectedMember);
                                            setSelectedMember(null);
                                        }}
                                        onClose={() => setSelectedMember(null)}
                                    />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    ) : (
                        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
                            <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>{selectedMember.name || 'Member'}'s Details</DialogTitle>
                                    <DialogDescription>View detailed information for {selectedMember.name || 'member'}.</DialogDescription>
                                </DialogHeader>
                                <MemberDetails
                                    member={selectedMember}
                                    onEdit={() => {
                                        handleEdit(selectedMember);
                                        setSelectedMember(null);
                                    }}
                                    onClose={() => setSelectedMember(null)}
                                />
                            </DialogContent>
                        </Dialog>
                    )
                )}
            </div>
        </AppLayout>
    );
};

export default Members;
