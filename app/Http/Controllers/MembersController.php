<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class MembersController extends Controller
{
    public function index()
    {
        // Pass members to the Members.tsx page
        return Inertia::render('Members', [
            'members' => Member::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'membership_type' => 'required|in:Monthly,Yearly',
            'start_date' => 'required|date',
            'expiry_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        Member::create($request->all());

        // Redirect back to the Members page with a success message
        return redirect()->route('members')->with('success', 'Member added successfully');
    }
}
