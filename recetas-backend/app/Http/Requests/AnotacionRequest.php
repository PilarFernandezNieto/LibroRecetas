<?php

namespace App\Http\Requests;

use App\Models\Anotacion;
use App\Models\Receta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class AnotacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'texto' => 'required|string|max:2000',
            'valoracion' => 'required|integer|between:1,5',
            'fecha_prueba' => 'required|date|before_or_equal:today',
        ];
    }

    /**
     * Regla "unique" compuesta (receta_id + user_id).
     *
     * Ninguno de los dos campos viene en el body (receta en la ruta, user en
     * la sesión), por eso no se puede usar Rule::unique sobre un campo.
     * Solo aplica al store: en update la anotación ya existe y no cambia
     * de receta ni de usuario.
     *
     * @return array<int, \Closure>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                $receta = $this->route('receta');

                if (! $receta instanceof Receta) {
                    return; // update/destroy: no hay {receta} en la ruta
                }

                $yaExiste = Anotacion::where('receta_id', $receta->id)
                    ->where('user_id', $this->user()->id)
                    ->exists();

                if ($yaExiste) {
                    $validator->errors()->add(
                        'receta',
                        'Ya has añadido una anotación a esta receta.'
                    );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'texto.required' => 'Debe añadir alguna anotación.',
            'texto.string' => 'La anotación debe de ser un texto.',
            'texto.max' => 'Se ha excedido en el tamaño de la anotación.',

            'valoracion.required' => 'Debe añadir una valoración.',
            'valoracion.integer' => 'La valoración debe ser un número entero.',
            'valoracion.between' => 'La valoración debe estar entre 1 y 5.',

            'fecha_prueba.required' => 'La fecha es obligatoria.',
            'fecha_prueba.date' => 'Debe introducir una fecha válida.',
            'fecha_prueba.before_or_equal' => 'La fecha no puede ser futura.',
        ];
    }
}
