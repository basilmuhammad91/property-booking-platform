<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
     public function index(User $user): bool
    {
        return $user->isGuest();
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Property $property): bool
    {
        return true;
    }

    public function show(User $user): bool
    {
        return $user->isGuest();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Property $property): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->isAdmin();
    }
}
