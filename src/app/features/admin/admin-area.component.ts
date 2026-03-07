import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-area',
  standalone: true,
  imports: [AdminHeaderComponent, RouterOutlet],
  templateUrl: './admin-area.component.html',
  styleUrl: './admin-area.component.css',
})
export class AdminAreaComponent {}
