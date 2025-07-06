<?php

return [
    'allowed_file_types' => explode(',', env('MEDIA_ALLOWED_FILE_TYPES', 'pdf,jpg,jpeg,png')),
    'max_file_size_mb' => env('MEDIA_MAX_FILE_SIZE_MB', 4),
];
