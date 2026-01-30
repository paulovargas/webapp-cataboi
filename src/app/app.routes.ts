import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ClientAreaComponent } from './features/client-area/client-area.component';
import { MyProfileComponent } from './features/my-profile/my-profile.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AnimalsListComponent } from './features/animal/pages/animals-list/animals-list.component';
import { AnimalsFormComponent } from './features/animal/pages/animals-form/animals-form.component';
import { EventsListComponent } from './features/event/pages/events-list/events-list.component';
import { EventsFormComponent } from './features/event/pages/events-form/events-form.component';
import { PropertiesListComponent } from './features/property/pages/properties-list/properties-list.component';
import { PropertiesFormComponent } from './features/property/pages/properties-form/properties-form.component';
import { HerdsListComponent } from './features/herd/pages/herds-list/herds-list.component';
import { HerdsFormComponent } from './features/herd/pages/herds-form/herds-form.component';
import { UsersListComponent } from './features/user/pages/users-list/users-list.component';
import { UsersFormComponent } from './features/user/pages/users-form/users-form.component';
import { ReportsAnimalsComponent } from './features/report/pages/reports-animals/reports-animals.component';

export const routes: Routes = [
  // Redireciona para dashboard ou home conforme a lógica de auth (simplificado aqui)
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    component: ClientAreaComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'animais', component: AnimalsListComponent },
      { path: 'animais/novo', component: AnimalsFormComponent },
      { path: 'animais/editar/:id', component: AnimalsFormComponent },

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

      {
        path: 'my-profile',
        component: MyProfileComponent,
        data: { title: 'Meu Perfil', modalStyle: '250vh', isModal: true },
      },
    ],
  },
];
