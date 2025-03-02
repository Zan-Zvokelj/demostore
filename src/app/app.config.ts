import { provideHttpClient } from '@angular/common/http'; // ✅ Add this
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CartService } from './services/cart.service'; // ✅ Add this
import { StoreService } from './services/store.service'; // ✅ Add this

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(), // ✅ This ensures HttpClient is provided
    StoreService, // ✅ Provide StoreService
    CartService, // ✅ Provide CartService
  ],
};
