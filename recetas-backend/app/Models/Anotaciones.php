<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anotaciones extends Model
{
    protected $table = 'anotaciones';
    protected $fillable = ['texto', 'valoracion', 'fecha_prueba'];

    protected function casts(): array
    {
        return [
            'fecha_prueba' => 'date',
            'valoracion' => 'integer',
        ];
    }

    public function receta()
    {
        return $this->belongsTo(Receta::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
