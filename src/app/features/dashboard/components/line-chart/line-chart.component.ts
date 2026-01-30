import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {
  public lineChartData: ChartData<'line'> = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Nascimentos',
        backgroundColor: 'rgba(77, 182, 172, 0.2)',
        borderColor: 'rgba(77, 182, 172, 1)',
        pointBackgroundColor: 'rgba(77, 182, 172, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77, 182, 172, 0.8)'
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Mortes',
        backgroundColor: 'rgba(239, 83, 80, 0.2)',
        borderColor: 'rgba(239, 83, 80, 1)',
        pointBackgroundColor: 'rgba(239, 83, 80, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(239, 83, 80, 1)'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public lineChartType: ChartType = 'line';

  public chartClicked({ event, active }: { event?: MouseEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: MouseEvent, active?: {}[] }): void {
    console.log(event, active);
  }
}