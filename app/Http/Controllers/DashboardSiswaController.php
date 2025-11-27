<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\TaskTable;
use Inertia\Inertia;

class DashboardSiswaController extends Controller
{
    public function index() {
        // Ambil semua data dan hitung
        $tasks = TaskTable::all();

        $totalTask = TaskTable::count();
        $tugasSelesai = TaskTable::where('sudah_selesai', 1)->count();
        $tugasPending = TaskTable::where('sudah_selesai', 0)->count();

        $stats = [
            'totalTask' => $totalTask,
            'tugasSelesai' => $tugasSelesai,
            'tugasPending' => $tugasPending,
        ];

        return Inertia::render('siswa/Dashboard/Index', [
            'stats' => $stats,
            'tasks' => $tasks,
            'flash' => [
                'success' =>session('success'),
                'error' =>session('error'),
            ]
        ]);
    }
}
