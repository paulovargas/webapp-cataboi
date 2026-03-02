import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { PropertiesFormComponent } from '../properties-form/properties-form.component';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent implements OnInit {
  properties: Property[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly propertiesService: PropertyService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.propertiesService.getProperties(this.page, this.size).subscribe({
      next: (page) => {
        this.properties = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  adicionarPropriedade(): void {
    const dialogRef = this.modalService.open({
      component: PropertiesFormComponent,
      title: 'Nova Propriedade',
      modalStyle: 'md',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadProperties());
  }

  editarPropriedade(property: Property): void {
    const dialogRef = this.modalService.open({
      component: PropertiesFormComponent,
      title: 'Editar Propriedade',
      object: property,
      modalStyle: 'md',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadProperties());
  }

  deleteProperty(id: number): void {
    if (!confirm('Deseja realmente excluir esta propriedade?')) {
      return;
    }

    this.propertiesService.delete(id).subscribe(() => this.loadProperties());
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }
    this.page--;
    this.loadProperties();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }
    this.page++;
    this.loadProperties();
  }
}
