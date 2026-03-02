import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AnimalsFormComponent } from '../animals-form/animals-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-animals-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animals-list.component.html',
  styleUrl: './animals-list.component.css',
})
export class AnimalsListComponent implements OnInit {
  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  searchControl = new FormControl('');
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly animalService: AnimalService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.loadAnimals();
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      this.filterAnimals(term || '');
    });
  }

  loadAnimals(): void {
    this.loading = true;
    this.animalService.getAnimals(this.page, this.size).subscribe({
      next: page => {
        this.animals = page.content;
        this.filteredAnimals = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterAnimals(term: string): void {
    const lowerCaseTerm = term.toLowerCase();
    this.filteredAnimals = this.animals.filter(animal =>
      animal.raca.toLowerCase().includes(lowerCaseTerm) ||
      animal.sexo.toLowerCase().includes(lowerCaseTerm)
    );
  }

  adicionarAnimal(): void {
    const dialogRef = this.modalService.open({
      component: AnimalsFormComponent,
      title: 'Adicionar Animal',
      modalStyle: 'lg',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadAnimals());
  }

  editarAnimal(animal: Animal): void {
    const dialogRef = this.modalService.open({
      component: AnimalsFormComponent,
      title: 'Detalhes do Animal',
      object: animal,
      modalStyle: 'lg',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadAnimals());
  }

  deleteAnimal(id: number): void {
    if (!confirm('Deseja realmente excluir este animal?')) {
      return;
    }

    this.animalService.deleteAnimal(id).subscribe(() => {
      this.loadAnimals();
    });
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }
    this.page--;
    this.loadAnimals();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }
    this.page++;
    this.loadAnimals();
  }
}
