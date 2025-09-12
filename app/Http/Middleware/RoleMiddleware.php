<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth('sanctum')->check() || !auth('sanctum')->user()->hasRole($role)) {
            return response()->json([
                'message' => "Unauthorized. {$role} access required.",
            ], 403);
        }

        return $next($request);
    }
}
