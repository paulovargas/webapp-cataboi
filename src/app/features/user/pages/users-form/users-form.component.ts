import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Cadastro de Usuário</h2><p>Formulário aqui...</p>`,
  styles: []
})
export class UsersFormComponent {}
