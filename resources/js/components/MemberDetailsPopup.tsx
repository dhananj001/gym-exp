import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Check, User } from 'lucide-react';
import { CheckCircle, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

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

interface MemberDetailsPopupProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

const MemberDetailsPopup: React.FC<MemberDetailsPopupProps> = ({ member, isOpen, onClose }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState(false);

    if (!member) return null;

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
        });
    };

    // Determine avatar based on gender with normalized case
    const getAvatarUrl = () => {
        const normalizedGender = member.gender ? member.gender.toLowerCase() : 'default';
        if (normalizedGender === 'male') {
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=male&skinColor=variant01&hair=maleShort01&hairColor=blonde';
        } else if (normalizedGender === 'female') {
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=female&skinColor=variant02&hair=femaleLong01&hairColor=brown';
        } else {
            return 'https://api.dicebear.com/9.x/adventurer/svg?seed=default&skinColor=variant03';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[80vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-blue-200 to-blue-300 dark:from-teal-500 dark:to-teal-600 p-6 rounded-t-2xl">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Cpath d=%22M0 0h80v80H0z%22 fill=%22none%22/%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2230%22 stroke=%22%23fff%22 stroke-width=%222%22 fill=%22none%22 opacity=%22.3%22/%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2220%22 stroke=%22%23fff%22 stroke-width=%222%22 fill=%22none%22 opacity=%22.3%22/%3E%3C/svg%3E')] bg-repeat"></div>
                    <DialogHeader className="flex items-center space-x-4">
                        {avatarError ? (
                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shadow-md border-2 border-white dark:border-gray-700">
                                <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                            </div>
                        ) : (
                            <img
                                src={getAvatarUrl()}
                                alt={`${member.name}'s avatar`}
                                className="w-16 h-16 rounded-full shadow-md border-2 border-white dark:border-gray-700 object-cover"
                                onError={() => setAvatarError(true)}
                            />
                        )}
                        <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{member.name}</DialogTitle>
                    </DialogHeader>
                </div>

                {/* Member Details */}
                <div className="p-6 space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
                            {/* Email */}
                            <div className="group relative p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                                <div className="flex items-center mt-1">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{member.email || 'N/A'}</p>
                                    {member.email && (
                                        <button
                                            onClick={() => handleCopy(member.email, 'email')}
                                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-teal-500"
                                        >
                                            {copiedField === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="group relative p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Phone</label>
                                <div className="flex items-center mt-1">
                                    <p className="text-sm text-gray-900 dark:text-gray-100">{member.phone || 'N/A'}</p>
                                    {member.phone && (
                                        <button
                                            onClick={() => handleCopy(member.phone, 'phone')}
                                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-blue-500 dark:text-teal-400 hover:text-blue-600 dark:hover:text-teal-500"
                                        >
                                            {copiedField === 'phone' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Birthdate */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Birthdate</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.birthdate || 'N/A'}</p>
                            </div>

                            {/* Age */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Age</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.age || 'N/A'}</p>
                            </div>

                            {/* Gender */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Gender</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.gender || 'N/A'}</p>
                            </div>

                            {/* Address */}
                            <div className=" group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Membership Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Membership Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">

                            {/* Membership Fee + Payment Status Icon */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Membership Fee (₹)</label>
                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                                    <span>{member.membership_fee || 'N/A'}</span>
                                    {member.payment_status === 'paid' ? (
                                        <CheckCircle className="text-green-500 w-5 h-5" title="Paid" />
                                    ) : (
                                        <XCircle className="text-red-500 w-5 h-5" title="Not Paid" />
                                    )}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Payment Method</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.payment_method || 'N/A'}</p>
                            </div>

                            {/* Workout Time Slot */}
                            <div className="group p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Workout Time Slot</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.workout_time_slot || 'N/A'}</p>
                            </div>

                        </div>
                    </div>


                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MemberDetailsPopup;
