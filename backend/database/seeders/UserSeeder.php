<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'username' => 'admin',
            'email' => 'admin@libtous.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        // Create regular users
        User::factory(10)->create([
            'role' => 'user'
        ]);
    }
}
