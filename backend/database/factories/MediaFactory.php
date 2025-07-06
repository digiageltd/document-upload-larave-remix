<?php

namespace Database\Factories;

use App\Enums\MediaCategoryEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'original_name' => $this->faker->lexify('document_????.jpg'),
            'file_name'     => $this->faker->uuid . '.jpg',
            'path'          => 'media/' . $this->faker->uuid . '.jpg',
            'type'          => 'image/jpeg',
            'category'      => $this->faker->randomElement([
                MediaCategoryEnum::PASSPORT->value,
                MediaCategoryEnum::VISA->value,
                MediaCategoryEnum::PHOTO->value,
            ]),
        ];
    }
}
