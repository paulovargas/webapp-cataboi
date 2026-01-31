import { AfterViewInit, Component, effect, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardInformationComponent } from './components/cards/card-information/card-information.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardInformationComponent,
    PieChartComponent,
    LineChartComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public totalAnimais: number = 0;
  public totalRebanhos: number = 0;

  constructor(private readonly storage: StorageService) {
    effect(() => {
      this.totalAnimais = this.storage.getTotalAnimais();
      this.totalRebanhos = this.storage.getTotalRebanhos();
    });
  }
  ngAfterViewInit(): void {
    this.totalAnimais = this.storage.getTotalAnimais();
    console.log('totalAnimais : ', this.totalAnimais);

    this.totalRebanhos = this.storage.getTotalRebanhos();
    console.log('totalRebanhos : ', this.totalRebanhos);
  }

  ngOnInit(): void {}
}
