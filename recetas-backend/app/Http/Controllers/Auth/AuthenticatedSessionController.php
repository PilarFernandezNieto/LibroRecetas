<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Comprueba las credenciales y devuelve un token Bearer.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $user = $request->authenticate();

        return response()->json([
            'token' => $user->createToken('spa')->plainTextToken,
            'user' => $user,
        ]);
    }

    /**
     * Revoca el token con el que se hizo la petición.
     */
    public function destroy(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}
