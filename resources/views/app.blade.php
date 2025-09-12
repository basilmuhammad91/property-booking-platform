<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Ziggy Routes (if using Ziggy) -->
    @routes

     @viteReactRefresh
    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])

    <!-- Inertia Head -->
    @inertiaHead
</head>
<body class="font-sans antialiased">
    <!-- This is where your Vue components will be mounted -->
    @inertia
</body>
</html>
