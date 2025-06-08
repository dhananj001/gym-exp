<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS scheme for URL generation when in production
        // This is crucial for fixing mixed content issues on platforms like Railway
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}
