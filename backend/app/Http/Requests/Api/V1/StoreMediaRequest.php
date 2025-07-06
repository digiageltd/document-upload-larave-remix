<?php

namespace App\Http\Requests\Api\V1;

use App\Enums\MediaCategoryEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreMediaRequest extends FormRequest
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
        $types = config('media.allowed_file_types');
        $maxSize = config('media.max_file_size_mb') * 1024; // Convert to KB

        return [
            'file' => [
                'required',
                File::types($types)->max($maxSize),
            ],
            'category' => [
                'required',
                Rule::enum(MediaCategoryEnum::class),
            ]
        ];
    }

    public function messages(): array
    {
        $maxSizeMb = config('media.max_file_size_mb');
        $allowedTypes = implode(', ', config('media.allowed_file_types'));

        return [
            'file.required' => 'Please upload a file.',
            'file.max' => "The file may not be greater than {$maxSizeMb}MB.",
            'file.types' => "Allowed file types: {$allowedTypes}.",
            'file.uploaded' => 'Failed to upload the file. Please try again.',
            'category.required' => 'Please select a category.',
            'category.enum' => 'The selected category is invalid.',
        ];
    }

    public function attributes(): array
    {
        return [
            'file' => 'media file',
            'category' => 'category',
        ];
    }


}
