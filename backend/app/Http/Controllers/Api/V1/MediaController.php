<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\MediaCategoryEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMediaRequest;
use App\Http\Resources\Api\V1\MediaCollection;
use App\Http\Resources\Api\V1\MediaResource;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class MediaController extends Controller
{
    /**
     * List all media files grouped by category.
     *
     * @return MediaCollection
     */
    public function index(): MediaCollection
    {
        $media = Media::all()->groupBy(fn($item) => $item->getCategoryKey());

        return new MediaCollection($media);
    }

    /**
     * Store a new media file.
     *
     * @param StoreMediaRequest $request
     * @param MediaService $mediaService
     * @return JsonResponse
     */
    public function store(StoreMediaRequest $request, MediaService $mediaService): JsonResponse
    {
        $media = $mediaService->upload(
            $request->file('file'),
            MediaCategoryEnum::from($request->input('category'))
        );

        return (new MediaResource($media))->response()->setStatusCode(201);
    }

    /**
     * Delete a media file.
     *
     * @param Media $media
     * @param MediaService $mediaService
     * @return JsonResponse
     */
    public function destroy(Media $media, MediaService $mediaService): JsonResponse
    {
        $mediaService->delete($media);

        /*
         * Just a quick note:
         * We can replace Response::HTTP_NO_CONTENT response()->noContent() for strict HTTP specs
         * however for this project I think it's perfectly fine like this.
         */
        return response()->json(['message' => 'File deleted successfully.'], Response::HTTP_NO_CONTENT);
    }
}
