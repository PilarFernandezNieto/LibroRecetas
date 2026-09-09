<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('recetas', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('nombre');
        });

        $this->backfillSlugs();

        Schema::table('recetas', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recetas', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }

    /**
     * Genera un slug único para cada receta existente a partir de su nombre.
     */
    private function backfillSlugs(): void
    {
        $usedSlugs = [];

        DB::table('recetas')->orderBy('id')->select('id', 'nombre')->each(function ($receta) use (&$usedSlugs) {
            $base = Str::slug($receta->nombre) ?: 'receta';
            $slug = $base;
            $i = 2;

            while (in_array($slug, $usedSlugs, true)) {
                $slug = "{$base}-{$i}";
                $i++;
            }

            $usedSlugs[] = $slug;

            DB::table('recetas')->where('id', $receta->id)->update(['slug' => $slug]);
        });
    }
};
