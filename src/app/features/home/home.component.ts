import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { HeroComponent } from "./components/hero/hero.component";
import { MainComponent } from "./components/main/main.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [HeaderComponent, HeroComponent, MainComponent, FooterComponent]
})
export class HomeComponent {
  // Propriedade para controlar a visibilidade da senha
  senhaVisivel = false;

  // Método para alternar a visibilidade
  toggleVisibilidadeSenha(): void {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
