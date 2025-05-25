import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Member Details: {member.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Birthdate</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.birthdate || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Age</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.age || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Gender</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.gender || 'N/A'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Membership Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Membership Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Membership Fee (₹)</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.membership_fee || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Payment Status</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.payment_status || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Payment Method</label>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{member.payment_method || 'N/A'}</p>
              </div>
              <div>
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
