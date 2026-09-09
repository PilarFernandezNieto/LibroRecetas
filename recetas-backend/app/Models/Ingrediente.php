<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;

class Ingrediente extends Model
{
    use HasSlug;

    protected $fillable = ['nombre', 'imagen', 'descripcion'];
}
