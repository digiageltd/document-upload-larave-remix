<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\MediaCategoryEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\CategoryCollection;

class CategoryController extends Controller
{
    public function index(): CategoryCollection
    {
        $categories = MediaCategoryEnum::meta();
        // Reindex as array with key field for each item
        $data = collect($categories)
            ->map(fn($val, $key) => array_merge(['key' => $key], $val))
            ->values();

        return new CategoryCollection($data);
    }
}
