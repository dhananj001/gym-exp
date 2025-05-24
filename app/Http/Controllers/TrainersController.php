<?php

namespace App\Http\Controllers;

use App\Models\Trainer;

class TrainersController extends Controller
{
    public function index()
    {
        return response()->json(Trainer::all());
    }
}
