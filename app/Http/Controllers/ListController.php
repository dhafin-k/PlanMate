<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskTable;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lists = TaskTable::where('user_id', Auth::user()->id)->get();
        return Inertia::render('admin/Lists/Index',[
            'lists' => $lists,
            'flash' =>[
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        TaskTable::create([
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'user_id' => Auth::id(),
        ]);
        return redirect()->route('lists.index')->with('success', 'List created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TaskTable $list)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:255',
        ]);

        $list->update($validated);
        return redirect()->route('lists.index')->with('success', 'Tugas Berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskTable $list)
    {
        $list -> delete();
        return redirect()->route('lists.index')->with('success', 'List deleted successfully.');
    }
}
