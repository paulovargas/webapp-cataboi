import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports-animals',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Relatório de Animais</h2><p>Gráficos e dados aqui...</p>`,
  styles: []
})
export class ReportsAnimalsComponent {}
