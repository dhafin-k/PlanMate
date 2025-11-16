<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_tables', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->string('deskripsi', 255)->nullable();
            $table->boolean('sudah_selesai')->default(false);
            $table->date('deadline')->nullable();
            $table->foreignId('list_id')->constrained('list_tables')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_tables');
    }
};
