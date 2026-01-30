import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-animals-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './animals-list.component.html',
  styleUrl: './animals-list.component.css'
})
export class AnimalsListComponent implements OnInit {
  animals: Animal[] = [];

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAnimals().subscribe(data => {
      this.animals = data;
    });
  }

  deleteAnimal(id: string): void {
    this.animalService.delete(id).subscribe(() => {
      this.loadAnimals();
    });
  }
}
