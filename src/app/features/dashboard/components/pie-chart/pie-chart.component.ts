import { Component } from '@angular/core';
// É necessário instalar as bibliotecas ng2-charts e chart.js
// npm install ng2-charts chart.js
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent {
  // Dados do gráfico de pizza
  public pieChartLabels: string[] = [
    'TERNEIRA(S) 0 - 12 MESES',
    'TERNEIRO(S) 0 - 12 MESES',
    'NOVILHA(S) 13 - 24 MESES',
    'NOVILHO(S) 13 - 24 MESES',
    'NOVILHA(S) 25 - 36 MESES',
    'NOVILHO(S) 25 - 36 MESES',
    'BOI(S) DE MAIS DE 36 MESES',
    'VACA(S) DE MAIS DE 36 MESES',
    'VENDIDOS TERNEIRAS DE 0 - 12 MESES',
  ];
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [300, 500, 100, 200, 400, 500, 700, 800, 900],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  // Eventos do gráfico
  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
