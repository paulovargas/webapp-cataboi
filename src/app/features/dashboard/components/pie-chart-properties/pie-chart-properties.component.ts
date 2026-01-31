import { Component, OnInit } from '@angular/core';
// É necessário instalar as bibliotecas ng2-charts e chart.js
// npm install ng2-charts chart.js
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';
import { StorageService } from '../../../../core/services/storage.service';
import { PropertyService } from '../../../property/services/property.service';
import { Property } from '../../../property/models/property.model';

@Component({
  selector: 'app-pie-chart-properties',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-properties.component.html',
  styleUrls: ['./pie-chart-properties.component.css'],
})
export class PieChartPropertiesComponent implements OnInit {
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

  properties: Property[] = [];

  constructor(private readonly propertiesService: PropertyService, private readonly storage: StorageService) {}

  ngOnInit(): void {
    this.propertiesService.getProperties().subscribe({
      next: (page) => {
        this.properties = page.content;

        this.pieChartLabels = this.properties.map((property) => property.nomePropriedade);

        this.quantidadeAnimais = this.properties.map(
          (property) => property.quantidadeAnimais,
        );

        console.log("quantidadeAnimais : ", this.quantidadeAnimais);

        this.storage.setTotalAnimais(this.quantidadeAnimais.reduce((a, b) => a + b, 0));

        console.log("totalAnimais : ", this.storage.getTotalAnimais());

        this.storage.setTotalRebanhos(this.properties.length);

        console.log("totalRebanhos : ", this.storage.getTotalRebanhos());

        this.storage.setTotalPropriedades(this.properties.length);

        console.log("totalPropriedades : ", this.storage.getTotalPropriedades());


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
