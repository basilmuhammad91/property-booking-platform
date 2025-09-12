<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    protected $redirectTo = '/dashboard';

    public function showLoginForm()
    {
        logger("showLoginForm..");
        return Inertia::render('Auth/Login');
    }

   protected function authenticated(Request $request, $user)
    {
        if ($request->wantsJson()) {
            return response()->json(['redirect' => '/']);
        }

        if ($user->hasRole('admin')) {
            return Inertia::location('/admin/properties');
        }

        return Inertia::location('/properties');
    }

     protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();

        $this->clearLoginAttempts($request);

        if ($response = $this->authenticated($request, $this->guard()->user())) {
            return $response;
        }

        return Inertia::location($this->redirectPath());
    }

    protected function redirectPath()
    {
        return view('welcome');
    }
}
