<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $baseName = fake()->name();
        return [
            'name' => $baseName,
            'username' => Str::slug($baseName) . '-' . Str::upper(Str::random(12)),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= 'passwordnya',
            'remember_token' => Str::random(10),
            // 'two_factor_secret' => Str::random(10),
            // 'two_factor_recovery_codes' => Str::random(10),
            'two_factor_confirmed_at' => now(),
            'class' => 'customer',
            'created_oleh' => 1, 
            'updated_oleh' => 1, 
            'branch_id' => null, 
            'is_active' => rand(0, 1),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model does not have two-factor authentication configured.
     */
    public function withoutTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }
}
