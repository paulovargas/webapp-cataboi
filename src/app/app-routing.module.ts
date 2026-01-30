import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientAreaComponent } from './features/client-area/client-area.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AnimalsListComponent } from './features/animal/pages/animals-list/animals-list.component';
import { AnimalsFormComponent } from './features/animal/pages/animals-form/animals-form.component';
import { EventsListComponent } from './features/animal/pages/animals-form/events-list.component';
import { EventsFormComponent } from './features/animal/pages/animals-form/events-form.component';
import { PropertiesListComponent } from './features/animal/pages/animals-form/properties-list.component';
import { PropertiesFormComponent } from './features/animal/pages/animals-form/properties-form.component';
import { HerdsListComponent } from './features/animal/pages/animals-form/herds-list.component';
import { HerdsFormComponent } from './features/animal/pages/animals-form/herds-form.component';
import { UsersListComponent } from './features/animal/pages/animals-form/users-list.component';
import { UsersFormComponent } from './features/animal/pages/animals-form/users-form.component';
import { ReportsAnimalsComponent } from './features/animal/pages/animals-form/reports-animals.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: ClientAreaComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // Rotas de Animais
      { path: 'animais', component: AnimalsListComponent },
      { path: 'animais/novo', component: AnimalsFormComponent },

      // Eventos
      { path: 'eventos', component: EventsListComponent },
      { path: 'eventos/novo', component: EventsFormComponent },

      // Propriedades
      { path: 'propriedades', component: PropertiesListComponent },
      { path: 'propriedades/novo', component: PropertiesFormComponent },

      // Rebanhos
      { path: 'rebanhos', component: HerdsListComponent },
      { path: 'rebanhos/novo', component: HerdsFormComponent },

      // Usuários
      { path: 'usuarios', component: UsersListComponent },
      { path: 'usuarios/novo', component: UsersFormComponent },

      // Relatórios
      { path: 'relatorios/animais', component: ReportsAnimalsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
