import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  erroLogin = '';
  enviando = false;
  senhaVisivel = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  mostraSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }

  login(event?: Event): void {
    event?.preventDefault();
    this.erroLogin = '';

    if (!this.email || !this.senha) {
      this.erroLogin = 'Informe email e senha.';
      return;
    }

    this.enviando = true;
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.enviando = false;
        const target = this.authService.isSystemAdmin() ? '/admin' : '/dashboard';
        this.router.navigate([target]);
      },
      error: () => {
        this.enviando = false;
        this.erroLogin = 'Credenciais invalidas.';
      },
    });
  }
}
