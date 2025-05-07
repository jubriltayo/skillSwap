<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://skill-swap-alpha-neon.vercel.app',
        'http://localhost:3000',
        '*'
    ],
    'allowed_headers' => ['*'],
];
