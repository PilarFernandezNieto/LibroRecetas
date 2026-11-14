<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnotacionRequest;
use App\Http\Resources\AnotacionResource;
use App\Models\Anotacion;
use App\Models\Receta;
use Illuminate\Support\Facades\Gate;

class AnotacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Receta $receta)
    {
        return AnotacionResource::collection(
            $receta->anotaciones()->with('user:id,name')->latest()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AnotacionRequest $request, Receta $receta)
    {
        $anotacion = $receta->anotaciones()->make($request->validated());
        $anotacion->user()->associate($request->user());
        $anotacion->save();

        return response()->json([
            "type" => "success",
            "message" => "Anotación guardada correctamente",
            "anotacion" => new AnotacionResource($anotacion->load('user:id,name')),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Anotacion $anotacion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AnotacionRequest $request, Anotacion $anotacion)
    {
        Gate::authorize('update', $anotacion);
        $anotacion->update($request->validated());

        return response()->json([
            "type" => "success",
            "anotacion" => new AnotacionResource($anotacion->load('user:id,name')),
            "message" => "Anotación actualizada."

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Anotacion $anotacion)
    {
        Gate::authorize('delete', $anotacion);
        $anotacion->delete();
        return response()->json([
            "type" => "success",
            "message" => "Anotación eliminada"
        ]);
    }
}
