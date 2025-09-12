<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy as ZiggyZiggy;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // 'auth' => [
            //     'user' => $request->user(),
            //     'is_logged_in' => auth()->check(),
            // ],
            'auth' => [
                'user' => fn() => Auth::user()
                    ? [
                        'id' => Auth::id(),
                        'name' => Auth::user()->name,
                        'roles' => Auth::user()->roles->pluck('name'),
                        'is_admin' => Auth::user()->hasRole('admin'),
                        'is_guest' => Auth::user()->hasRole('guest'),
                    ]
                    : null,
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new ZiggyZiggy())->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}
