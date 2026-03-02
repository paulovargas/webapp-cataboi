import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Herd } from '../../models/herd.model';
import { HerdService } from '../../services/herd.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { HerdsFormComponent } from '../herds-form/herds-form.component';

@Component({
  selector: 'app-herds-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herds-list.component.html',
  styleUrl: './herds-list.component.css'
})
export class HerdsListComponent implements OnInit {
  herds: Herd[] = [];
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly herdService: HerdService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadHerds();
  }

  loadHerds(): void {
    this.loading = true;
    this.herdService.getHerds(this.page, this.size).subscribe({
      next: page => {
        this.herds = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteHerd(id: number): void {
    if (!confirm('Deseja realmente excluir este rebanho?')) {
      return;
    }

    this.herdService.delete(id).subscribe(() => this.loadHerds());
  }

  adicionarRebanho(): void {
    const dialogRef = this.modalService.open({
      component: HerdsFormComponent,
      title: 'Novo Rebanho',
      modalStyle: 'md',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadHerds());
  }

  editarRebanho(herd: Herd): void {
    const dialogRef = this.modalService.open({
      component: HerdsFormComponent,
      title: 'Editar Rebanho',
      object: herd,
      modalStyle: 'md',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadHerds());
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }
    this.page--;
    this.loadHerds();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }
    this.page++;
    this.loadHerds();
  }
}
