<?php

namespace Tests\Feature\Api\V1;

use App\Enums\MediaCategoryEnum;
use App\Models\Media;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_upload_a_file()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/v1/media', [
            'file' => $file,
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'data' => [
                    'id', 'original_name', 'file_name', 'url', 'type', 'category', 'created_at', 'updated_at'
                ]
            ]);

        // Assert the file was stored
        Storage::disk('public')->assertExists('media/'.$response['data']['file_name']);

        // Assert DB has record
        $this->assertDatabaseHas('media', [
            'original_name' => 'test.jpg',
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);
    }

    #[Test]
    public function it_can_list_files_grouped_by_category()
    {
        Media::factory()->count(2)->create(['category' => MediaCategoryEnum::PASSPORT]);
        Media::factory()->create(['category' => MediaCategoryEnum::VISA]);

        $response = $this->getJson('/api/v1/media');
        $response->assertOk();
        $responseData = $response->json();

        $data = $responseData['data'];
        $this->assertArrayHasKey(MediaCategoryEnum::PASSPORT->value, $data);
        $this->assertArrayHasKey(MediaCategoryEnum::VISA->value, $data);
        $this->assertCount(2, $data[MediaCategoryEnum::PASSPORT->value]);
        $this->assertCount(1, $data[MediaCategoryEnum::VISA->value]);

    }

    #[Test]
    public function it_rejects_invalid_file_type()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('test.txt', 10); // Not an allowed type

        $response = $this->postJson('/api/v1/media', [
            'file' => $file,
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['file']);
    }

    #[Test]
    public function it_rejects_invalid_category()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/v1/media', [
            'file' => $file,
            'category' => 'not-a-category',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category']);
    }

    #[Test]
    public function it_can_delete_a_file()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('delete.jpg');
        $media = Media::factory()->create([
            'file_name' => 'delete.jpg',
            'path' => 'media/delete.jpg',
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);
        Storage::disk('public')->put('media/delete.jpg', 'dummy content');

        $response = $this->deleteJson("/api/v1/media/{$media->id}");

        $response->assertNoContent();
        Storage::disk('public')->assertMissing('media/delete.jpg');
        $this->assertDatabaseMissing('media', ['id' => $media->id]);
    }

    #[Test]
    public function it_rejects_missing_file()
    {
        $response = $this->postJson('/api/v1/media', [
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    #[Test]
    public function it_rejects_missing_category()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('test.jpg');
        $response = $this->postJson('/api/v1/media', ['file' => $file]);
        $response->assertStatus(422)->assertJsonValidationErrors(['category']);
    }

    #[Test]
    public function it_rejects_file_too_large()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB
        $response = $this->postJson('/api/v1/media', [
            'file' => $file,
            'category' => MediaCategoryEnum::PHOTO->value,
        ]);
        $response->assertStatus(422)->assertJsonValidationErrors(['file']);
    }

    #[Test]
    public function it_returns_empty_array_when_no_files()
    {
        $response = $this->getJson('/api/v1/media');
        $response->assertOk();
        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertEmpty($data);
    }

    #[Test]
    public function it_returns_404_for_non_existent_delete()
    {
        $response = $this->deleteJson('/api/v1/media/999');
        $response->assertStatus(404);
    }

}
