<?php

namespace App\Enums;

enum MediaCategoryEnum: string
{
    case PASSPORT = 'passport';
    case VISA = 'visa';
    case PHOTO = 'photo';

    public static function meta(): array
    {
        return [
            self::VISA->value => [
                'label' => 'Visa Application Form',
                'description' => 'Upload your completed and signed national visa application form. This document is required to start your visa process.',
                'max_files' => 2,
            ],
            self::PHOTO->value => [
                'label' => 'Passport Photos',
                'description' => 'Upload two recent, passport-style photos. Photos must be in color, taken within the last 6 months, and meet official requirements.',
                'max_files' => 2,
            ],
            self::PASSPORT->value => [
                'label' => 'Passport',
                'description' => 'Upload a scan or photo of your valid passport. Your passport must be valid for at least 6 months beyond your intended stay.',
                'max_files' => 1,
            ],
        ];
    }
}
