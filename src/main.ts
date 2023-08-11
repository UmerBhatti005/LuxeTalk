import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app'; // Import initializeApp
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';


  enableProdMode();
// Initialize Firebase before bootstrapping the Angular app
initializeApp(environment); // Pass your Firebase configuration object


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
