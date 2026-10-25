<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Verifica el email a partir del enlace firmado del correo.
     *
     * El enlace se abre en el navegador sin token Bearer, así que el usuario
     * se identifica por {id} y {hash}; la firma (middleware "signed") garantiza
     * que la URL no ha sido manipulada.
     */
    public function __invoke(string $id, string $hash): RedirectResponse
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            abort(403, 'Enlace de verificación no válido.');
        }

        if (! $user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect(config('app.frontend_url') . '/auth/login?verified=1');
    }
}
