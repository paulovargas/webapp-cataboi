import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AnimalsFormComponent } from '../animals-form/animals-form.component';

@Component({
  selector: 'app-animals-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animals-list.component.html',
  styleUrl: './animals-list.component.css',
})
export class AnimalsListComponent implements OnInit {
  animals: Animal[] = [];
  animal: Animal = {} as Animal;

  constructor(
    private readonly animalService: AnimalService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAnimals().subscribe({
      next: page => this.animals = page.content,
      error: err => console.error(err)
    });
  }

  adicionarAnimal(): void {
    this.modalService.open({
      component: AnimalsFormComponent,
      title: 'Adicionar Animal',
      modalStyle: 'lg',
    });
  }

  editarAnimal(animal: Animal): void {
    this.modalService.open({
      component: AnimalsFormComponent,
      title: 'Detalhes do Animal',
      object: animal,
      modalStyle: 'lg',
    });
  }

  deleteAnimal(id: number): void {
    /* this.animalService.delete(id).subscribe(() => {
      this.loadAnimals();
    }); */
  }
}
