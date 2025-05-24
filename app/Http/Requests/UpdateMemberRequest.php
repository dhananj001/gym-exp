<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authentication/authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:members,email,' . $this->member->id],
            'gender' => ['required', 'in:male,female,other'],
            'dob' => ['required', 'date'],
            'contact_number' => ['required', 'string', 'regex:/^\+?\d{10,15}$/'],
            'address' => ['required', 'string', 'max:500'],
            'membership_plan' => ['required', 'in:cardio,hardcore'],
            'membership_type' => ['required', 'in:1_month,3_months,6_months,1_year,custom'],
            'trainer_id' => ['nullable', 'exists:trainers,id'],
            'start_date' => ['required', 'date'],
            'expiry_date' => ['required', 'date', 'after:start_date'],
            'payment_mode' => ['required', 'in:cash,card,upi,bank_transfer'],
            'payment_status' => ['nullable', 'in:paid,pending'],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'contact_number.regex' => 'The contact number must be a valid phone number (10-15 digits, optional + prefix).',
            'email.unique' => 'This email is already registered.',
            'expiry_date.after' => 'The expiry date must be after the start date.',
        ];
    }
}
