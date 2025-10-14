import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    // Rota padrão que carrega o HomeComponent na raiz do site
    { path: '', component: HomeComponent }
];
