import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardInformationComponent } from './components/cards/card-information/card-information.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardInformationComponent, PieChartComponent, LineChartComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}
