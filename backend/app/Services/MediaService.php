<?php

namespace App\Services;

use App\Enums\MediaCategoryEnum;
use App\Models\Media;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MediaService
{
    /**
     * Uploads a file and creates a Media record.
     *
     * @param UploadedFile $file
     * @param MediaCategoryEnum $category
     * @return Media
     * @throws ValidationException
     */
    public function upload(UploadedFile $file, MediaCategoryEnum $category): Media
    {
        $originalName = $file->getClientOriginalName();
        $uuidName = sprintf("%s.%s", Str::uuid(), $file->getClientOriginalExtension());
        $type = $file->getClientMimeType();

        try {
            $media = Media::create([
                'original_name' => $originalName,
                'file_name' => $uuidName,
                'path' => null,
                'type' => $type,
                'category' => $category->value,
            ]);
        } catch (QueryException $e) {
            Log::error('Database write failed', ['error' => $e->getMessage()]);
            throw ValidationException::withMessages([
                'database' => 'Failed to save file metadata. Please try again.',
            ]);
        } catch (Exception $e) {
            Log::error('Unexpected DB error', ['error' => $e->getMessage()]);
            throw ValidationException::withMessages([
                'database' => 'An unexpected error occurred while saving file metadata.',
            ]);
        }

        try {
            $path = $file->storeAs('media/'.$media->id, $uuidName, 'public');

            if (!$path) {
                $media->delete();
                throw ValidationException::withMessages([
                    'file' => 'Failed to store file on disk.',
                ]);
            }

            $media->update(['path' => $path]);
            return $media;

        } catch (Exception $e) {
            $media->delete();
            Log::error('File storage failed', ['error' => $e->getMessage()]);
            throw ValidationException::withMessages([
                'file' => 'Unexpected error during file storage.',
            ]);
        }
    }


    /**
     * Deletes the file from storage and removes the Media record.
     *
     * @param Media $media
     * @throws ValidationException
     */
    public function delete(Media $media): void
    {
        try {
            if (!Storage::disk('public')->exists($media->path)) {
                Log::warning('Attempted to delete missing file', ['media_id' => $media->id, 'path' => $media->path]);
            } else {
                if (!Storage::disk('public')->delete($media->path)) {
                    throw ValidationException::withMessages([
                        'file' => 'Failed to delete file from disk.',
                    ]);
                }
            }

            $media->delete();
        } catch (ValidationException $ve) {
            throw $ve;
        } catch (Exception $e) {
            Log::error('Unexpected error during file deletion',
                ['media_id' => $media->id, 'error' => $e->getMessage()]);

            throw ValidationException::withMessages([
                'file' => 'Unexpected error while deleting the file.',
            ]);
        }
    }
}
