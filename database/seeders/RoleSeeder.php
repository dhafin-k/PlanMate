<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try {
            if (DB::table('roles')->count() == 0) {
                DB::table('roles')->insert([
                    [
                        'id' => 1,
                        'nama_role' => 'admin',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                    [
                        'id' => 2,
                        'nama_role' => 'siswa',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);

                $this->command->info('RoleSeeder: Data inserted successfully.');
            } else {
                $this->command->warn('RoleSeeder: Table already contains data, skipping insert.');
            }
        } catch (Exception $e) {
            $this->command->error('RoleSeeder: Failed to insert data. Error: ' . $e->getMessage());
        }
    }
}
