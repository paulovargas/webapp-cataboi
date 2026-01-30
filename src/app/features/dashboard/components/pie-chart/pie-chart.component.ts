import { Component, OnInit } from '@angular/core';
// É necessário instalar as bibliotecas ng2-charts e chart.js
// npm install ng2-charts chart.js
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { HerdService } from '../../../herd/services/herd.service';
import { Herd } from '../../../herd/models/herd.model';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  // Dados do gráfico de pizza
  public pieChartLabels: string[] = [];
  public quantidadeAnimais: number[] = [];

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: this.quantidadeAnimais,
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  herds: Herd[] = [];

  constructor(private readonly herdService: HerdService) {}

  ngOnInit(): void {
    this.herdService.getHerds().subscribe({
      next: (page) => {
        this.herds = page.content;

        this.pieChartLabels = this.herds.map((herd) => herd.nomeRebanho);

        this.quantidadeAnimais = this.herds.map(
          (herd) => herd.quantidadeAnimais,
        );

        this.pieChartData = {
          labels: this.pieChartLabels,
          datasets: [
            {
              data: this.quantidadeAnimais,
            },
          ],
        };
      },
      error: (err) => console.error(err),
    });
  }

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
