import React, { useState, useEffect } from 'react';
import { InertiaForm } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface MembershipFormProps {
  data: FormData;
  setData: InertiaForm<FormData>['setData'];
  errors: Partial<Record<keyof FormData, string>>;
  handleSubmit: (e: React.FormEvent) => void;
  setIsOpen: (open: boolean) => void;
  mode?: 'add' | 'edit';
}

const MembershipForm: React.FC<MembershipFormProps> = ({
  data,
  setData,
  errors,
  handleSubmit,
  setIsOpen,
  mode = 'add',
}) => {
  const [step, setStep] = useState(1);

  // Recalculate age when birthdate changes
  useEffect(() => {
    if (data.birthdate) {
      const birthDate = new Date(data.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setData('age', age.toString());
    } else {
      setData('age', '');
    }
  }, [data.birthdate, setData]);

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <div className="w-[620px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Form Submission Failed</AlertTitle>
          <AlertDescription>
            Please correct the following errors:
            <ul className="list-disc ml-4 mt-2">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Indicators */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-full">
          <div className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 1
                  ? 'bg-blue-500 text-white dark:bg-teal-400 dark:text-gray-900'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
              } transition-all duration-300`}
            >
              1
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Personal Info</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 mx-2 rounded-full overflow-hidden">
            <div
              className={`h-full bg-blue-500 dark:bg-teal-400 transition-all duration-500 ease-in-out`}
              style={{ width: step === 2 ? '100%' : '0%' }}
            />
          </div>
          <div className="flex items-center flex-1 justify-end">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 2
                  ? 'bg-blue-500 text-white dark:bg-teal-400 dark:text-gray-900'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
              } transition-all duration-300`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Membership Info</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Name <span className="text-blue-500 dark:text-teal-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="rampatil001@example.com"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              {/* Birthdate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Birthdate</label>
                <input
                  type="date"
                  value={data.birthdate}
                  onChange={(e) => setData('birthdate', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.birthdate && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.birthdate}</p>}
              </div>

              {/* Age (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Age</label>
                <input
                  type="text"
                  value={data.age}
                  readOnly
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm cursor-not-allowed"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender</label>
                <select
                  value={data.gender}
                  onChange={(e) => setData('gender', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-700">
                    Select
                  </option>
                  <option value="male" className="bg-white dark:bg-gray-700">Male</option>
                  <option value="female" className="bg-white dark:bg-gray-700">Female</option>
                  <option value="other" className="bg-white dark:bg-gray-700">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.gender}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Address</label>
                <textarea
                  rows={3}
                  value={data.address || ''}
                  onChange={(e) => {
                    console.log('Address changed to:', e.target.value); // Debug log
                    setData('address', e.target.value);
                  }}
                  placeholder="Enter full address"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200 resize-none"
                />
                {errors.address && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Membership Information */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              {/* Membership Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Membership Type <span className="text-blue-500 dark:text-teal-400">*</span>
                </label>
                <select
                  value={data.membership_type}
                  onChange={(e) => setData('membership_type', e.target.value as FormData['membership_type'])}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-700">
                    Select
                  </option>
                  <option value="1_month" className="bg-white dark:bg-gray-700">1 Month</option>
                  <option value="3_months" className="bg-white dark:bg-gray-700">3 Months</option>
                  <option value="6_months" className="bg-white dark:bg-gray-700">6 Months</option>
                  <option value="1_year" className="bg-white dark:bg-gray-700">1 Year</option>
                  <option value="custom" className="bg-white dark:bg-gray-700">Custom</option>
                </select>
                {errors.membership_type && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.membership_type}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Start Date <span className="text-blue-500 dark:text-teal-400">*</span>
                </label>
                <input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.start_date && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.start_date}</p>}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={data.expiry_date}
                  onChange={(e) => setData('expiry_date', e.target.value)}
                  disabled={data.membership_type !== 'custom'}
                  className={`w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200 ${
                    data.membership_type !== 'custom' ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : 'bg-white dark:bg-gray-700'
                  }`}
                />
                {errors.expiry_date && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.expiry_date}</p>}
              </div>

              {/* Membership Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Fee (₹) <span className="text-blue-500 dark:text-teal-400">*</span>
                </label>
                <input
                  type="number"
                  value={data.membership_fee}
                  onChange={(e) => setData('membership_fee', e.target.value)}
                  placeholder="5000"
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                />
                {errors.membership_fee && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.membership_fee}</p>}
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Payment Status <span className="text-blue-500 dark:text-teal-400">*</span>
                </label>
                <select
                  value={data.payment_status}
                  onChange={(e) => setData('payment_status', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-700">
                    Select
                  </option>
                  <option value="paid" className="bg-white dark:bg-gray-700">Paid</option>
                  <option value="partial" className="bg-white dark:bg-gray-700">Partial</option>
                  <option value="unpaid" className="bg-white dark:bg-gray-700">Unpaid</option>
                </select>
                {errors.payment_status && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.payment_status}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Payment Method</label>
                <select
                  value={data.payment_method}
                  onChange={(e) => setData('payment_method', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-700">
                    Select
                  </option>
                  <option value="cash" className="bg-white dark:bg-gray-700">Cash</option>
                  <option value="card" className="bg-white dark:bg-gray-700">Card</option>
                  <option value="upi" className="bg-white dark:bg-gray-700">UPI</option>
                  <option value="netbanking" className="bg-white dark:bg-gray-700">Net Banking</option>
                </select>
                {errors.payment_method && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.payment_method}</p>}
              </div>

              {/* Workout Time Slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Workout Slot</label>
                <select
                  value={data.workout_time_slot}
                  onChange={(e) => setData('workout_time_slot', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:border-teal-400 dark:focus:ring-teal-400/30 transition-all duration-200"
                >
                  <option value="" disabled className="bg-white dark:bg-gray-700">
                    Select
                  </option>
                  <option value="Morning" className="bg-white dark:bg-gray-700">Morning</option>
                  <option value="Evening" className="bg-white dark:bg-gray-700">Evening</option>
                </select>
                {errors.workout_time_slot && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.workout_time_slot}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 mt-6">
          <button
            type="button"
            onClick={() => (step === 1 ? setIsOpen(false) : handleBack())}
            className="px-4 py-2 border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 dark:bg-teal-400 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-blue-600 dark:hover:bg-teal-500 transition-all duration-200 transform hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 dark:bg-teal-400 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-blue-600 dark:hover:bg-teal-500 transition-all duration-200 transform hover:scale-105"
            >
              {mode === 'add' ? 'Add Member' : 'Update Member'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MembershipForm;
