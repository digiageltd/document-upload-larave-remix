<?php

namespace App\Models;

use App\Enums\MediaCategoryEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;
    protected $fillable = [
        'original_name',
        'file_name',
        'path',
        'type',
        'category',
    ];

    public function casts(): array
    {
        return [
            'category' => MediaCategoryEnum::class,
        ];
    }

    /**
     * Get the category value as a string, regardless of enum/storage.
     *
     * @return string|null
     */
    public function getCategoryKey(): ?string
    {
        if ($this->category instanceof \BackedEnum) {
            return $this->category->value;
        }

        return $this->category;
    }
}
