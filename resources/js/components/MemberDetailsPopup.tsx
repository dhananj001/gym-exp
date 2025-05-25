import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { User, X } from 'lucide-react';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
    id: number;
    name: string;
    email: string;
    phone: string;
    membership_type: '1_month' | '3_months' | '6_months' | '1_year' | 'custom';
    start_date: string;   // ISO string
    expiry_date: string;  // ISO string
    birthdate: string;    // ISO string
    age: string;
    gender: string;
    address: string;
    membership_fee: string;
    payment_status: string; // 'paid' | 'unpaid' or similar
    payment_method: string;
    workout_time_slot: string;
}

interface MemberDetailsPopupProps {
    member: Member | null;
    isOpen: boolean;
    onClose: () => void;
}

const MemberDetailsPopup: React.FC<MemberDetailsPopupProps> = ({ member, isOpen, onClose }) => {
    const [avatarError, setAvatarError] = useState(false);
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        if (member) {
            const expiry = new Date(member.expiry_date);
            const today = new Date();
            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysLeft(diffDays >= 0 ? diffDays : 0);
        }
    }, [member]);

    if (!member) return null;

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

    // Payment status badge color
    const paymentStatusBadge = member.payment_status === 'paid'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent as={motion.div}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.3 }}
                        className="!max-w-[80vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700"
                    >
                        {/* Sticky header with avatar, name, close button */}
                        <div className="sticky top-0 z-30 bg-gradient-to-r from-blue-200 to-blue-300 dark:from-teal-500 dark:to-teal-600 p-6 rounded-t-2xl flex items-center justify-between shadow-md">
                            <div className="flex items-center space-x-4">
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

                                {/* Payment Status Badge */}
                                <span className={cn("ml-4 px-3 py-1 rounded-full font-semibold text-sm", paymentStatusBadge)}>
                                    {member.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                </span>

                                {/* Days left badge */}
                                {daysLeft !== null && (
                                    <span className="ml-2 px-3 py-1 rounded-full bg-yellow-200 text-yellow-900 dark:bg-yellow-700 dark:text-yellow-300 font-semibold text-sm" title="Days left before membership expires">
                                        {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                                    </span>
                                )}
                            </div>

                            {/* Close Button */}
                            {/* <button
                                onClick={onClose}
                                aria-label="Close details popup"
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                            >
                                <X className="w-6 h-6" />
                            </button> */}
                        </div>

                        {/* Member Details */}
                        <div className="p-6 space-y-8">

                            {/* Personal Information Group */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Email */}
                                    <ReadOnlyField label="Email" value={member.email} />

                                    {/* Phone */}
                                    <ReadOnlyField label="Phone" value={member.phone} />

                                    {/* Birthdate */}
                                    <ReadOnlyField label="Birthdate" value={member.birthdate} />

                                    {/* Age */}
                                    <ReadOnlyField label="Age" value={member.age} />

                                    {/* Gender */}
                                    <ReadOnlyField label="Gender" value={member.gender} />

                                    {/* Address */}
                                    <ReadOnlyField label="Address" value={member.address} />

                                </div>
                            </section>

                            {/* Membership Information Group */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Membership Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Membership Fee + Payment Status Icon */}
                                    <div className="p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-transform transform hover:scale-[1.02]">
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide">Membership Fee (₹)</label>
                                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                                            <span>{member.membership_fee || 'N/A'}</span>
                                            {member.payment_status === 'paid' ? (
                                                <CheckCircle className="text-green-500 w-5 h-5" title="Paid" />
                                            ) : (
                                                <XCircle className="text-red-500 w-5 h-5" title="Not Paid" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <ReadOnlyField label="Payment Method" value={member.payment_method} />

                                    {/* Workout Time Slot */}
                                    <ReadOnlyField label="Workout Time Slot" value={member.workout_time_slot} />

                                </div>
                            </section>

                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

// Read-only field without copy button and with enhanced label style
interface ReadOnlyFieldProps {
    label: string;
    value: string | null | undefined;
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, value }) => (
    <div className="p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <label className="block text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 uppercase tracking-wide">{label}</label>
        <p className="text-sm text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
);

export default MemberDetailsPopup;
