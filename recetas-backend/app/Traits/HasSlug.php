<?php

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Genera y mantiene un slug único a partir del campo "nombre" del modelo,
 * y lo usa como route key para el binding implícito de rutas.
 */
trait HasSlug
{
    public static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            $model->slug = $model->generateUniqueSlug();
        });

        static::updating(function ($model) {
            if ($model->isDirty('nombre') || empty($model->slug)) {
                $model->slug = $model->generateUniqueSlug();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected function generateUniqueSlug(): string
    {
        $base = Str::slug($this->nombre) ?: Str::slug(class_basename($this));
        $slug = $base;
        $i = 2;

        while (
            static::where('slug', $slug)
                ->when($this->exists, fn ($query) => $query->where($this->getKeyName(), '!=', $this->getKey()))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
