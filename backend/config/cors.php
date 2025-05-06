<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://your-vercel-app.vercel.app',
        'http://localhost:3000'
    ],
    'allowed_headers' => ['*'],
];
