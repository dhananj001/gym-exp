import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Define the Member interface for TypeScript
interface Member {
    id: number;
    name: string;
    email: string;
    membership_type: 'Monthly' | 'Yearly';
    start_date: string;
    expiry_date: string;
}

// Define form data interface
interface FormData {
    name: string;
    email: string;
    membership_type: 'Monthly' | 'Yearly';
    start_date: string;
    expiry_date: string;
}

// Define props for the page
interface PageProps {
    members: Member[];
    flash?: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Members',
        href: '/members',
    },
];

const Members: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { members, flash } = props;

    const { data, setData, post, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        membership_type: 'Monthly',
        start_date: '',
        expiry_date: '',
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/members', {
            preserveState: true,
            onSuccess: () => {
                reset(); // Reset form fields
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold text-gray-800">Gym Members Management</h1>

                {/* Success Message */}
                {flash?.success && (
                    <div className="mb-4 rounded-md bg-green-100 p-4 text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Add Member Form */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Member</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                                <select
                                    value={data.membership_type}
                                    onChange={(e) => setData('membership_type', e.target.value as 'Monthly' | 'Yearly')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                                {errors.membership_type && (
                                    <p className="text-red-500 text-sm mt-1">{errors.membership_type}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.start_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input
                                    type="date"
                                    value={data.expiry_date}
                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.expiry_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Add Member
                        </button>
                    </form>
                </div>

                {/* Members List */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Members List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Membership Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Expiry Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {members.map((member) => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.membership_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.start_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.expiry_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(member.expiry_date) > new Date() ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-600">Expired</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Members;
