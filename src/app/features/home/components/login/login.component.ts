import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    // Propriedade para controlar a visibilidade da senha
  senhaVisivel = false;

  /**
   *
   */
  constructor(
    private router : Router
  ) {}

  // Método para alternar a visibilidade
  mostraSenha(): void {
    console.log("Mostra senha !")
    this.senhaVisivel = !this.senhaVisivel;
  }

  login(): void {
    this.router.navigate(['/dashboard']);
  }
}
