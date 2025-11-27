<?php

namespace App\Http\Controllers;

use App\Models\ListTable;
use App\Models\TaskTable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskSiswaController extends Controller
{
    public function index(Request $request)
    {
        // Ambil SEMUA task tanpa filter user
        $query = TaskTable::with('list')->orderBy('created_at', 'desc');

        // Search di judul dan deskripsi
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        // Filter berdasarkan status
        if ($request->filled('filter') && $request->input('filter') !== 'all') {
            $filter = $request->input('filter');
            if ($filter === 'completed') {
                $query->where('sudah_selesai', true);
            } elseif ($filter === 'pending') {
                $query->where('sudah_selesai', false);
            }
        }

        $tasks = $query->paginate(10);

        // Ambil semua list
        $lists = ListTable::all();

        return Inertia::render('siswa/Task/Index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'filters' => [
                'search' => $request->input('search', ''),
                'filter' => $request->input('filter', 'all')
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        // Ambil task berdasarkan ID aja, tanpa filter user
        $task = TaskTable::findOrFail($id);

        $request->validate([
            'sudah_selesai' => 'required|boolean',
        ]);

        $task->update([
            'sudah_selesai' => $request->sudah_selesai,
        ]);

        return redirect()->route('siswa.tasks.index')
            ->with('success', 'Status tugas berhasil diperbarui!');
    }
}
