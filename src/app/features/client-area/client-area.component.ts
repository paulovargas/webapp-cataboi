import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-client-area',
  imports: [HeaderComponent, MainComponent, RouterOutlet],
  templateUrl: './client-area.component.html',
  styleUrl: './client-area.component.css'
})
export class ClientAreaComponent {

}
