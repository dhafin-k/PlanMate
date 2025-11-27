<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskTable;
use App\Models\ListTable;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index() {
        $user = Auth::user();
        $lists = ListTable::where('user_id', $user->id)->get();
        $totalRole = Role::count();
        $tasks = TaskTable::whereHas('list', function($query) use ($user){
            $query->where('user_id', $user->id);
        })->get();

        $chartData = $this->getTaskChartData();

        $stats = [
            'totalList' => $lists->count(),
            'totalTask' => $tasks->count(),
            'tugasSelesai' => $tasks->where('sudah_selesai',1)->count(),
            'tugasPending' => $tasks->where('sudah_selesai',0)->count(),
            'totalUser' => User::count(),
            'totalRole' => $totalRole
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'tasks' => $tasks,
            'lists' => $lists,
            'totalRole' => $totalRole,
            'chartData' => $chartData,
            'flash' => [
                'success' =>session('success'),
                'error' =>session('error'),
            ]
        ]);
    }
    private function getTaskChartData()
    {
        $user = Auth::user();

        // Ambil 12 bulan terakhir
        $months = [];
        $data = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthName = $date->format('F'); // Nama bulan (January, February, etc)
            $months[] = $monthName;

            // Hitung task yang dibuat pada bulan tersebut
            $taskCount = TaskTable::whereHas('list', function($query) use ($user){
                $query->where('user_id', $user->id);
            })
            ->whereYear('created_at', $date->year)
            ->whereMonth('created_at', $date->month)
            ->count();

            $data[] = [
                'month' => $monthName,
                'tasks' => $taskCount
            ];
        }

        return $data;
    }
}
