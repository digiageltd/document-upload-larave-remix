<?php

namespace Feature\Api\V1;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_list_all_media_categories_with_meta()
    {
        $response = $this->getJson('/api/v1/media/categories');

        $response->assertOk();
        $data = $response->json('data');

        // Basic structure checks
        $this->assertIsArray($data);
        foreach ($data as $category) {
            $this->assertArrayHasKey('key', $category);
            $this->assertArrayHasKey('label', $category);
            $this->assertArrayHasKey('description', $category);
            $this->assertArrayHasKey('max_files', $category);
        }

        $categoryKeys = array_column($data, 'key');
        $this->assertContains('passport', $categoryKeys);
        $this->assertContains('visa', $categoryKeys);
        $this->assertContains('photo', $categoryKeys);
    }
}
