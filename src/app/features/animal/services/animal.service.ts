import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Animal } from '../models/animal.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private mockAnimals: Animal[] = [
    { id: '1', name: 'Mimosa', breed: 'Nelore', sex: 'Fêmea', birthDate: new Date('2022-01-15'), weight: 450 },
    { id: '2', name: 'Valente', breed: 'Angus', sex: 'Macho', birthDate: new Date('2021-11-20'), weight: 600 },
    { id: '3', name: 'Estrela', breed: 'Girolando', sex: 'Fêmea', birthDate: new Date('2023-03-10'), weight: 300 },
    { id: '4', name: 'Trovão', breed: 'Brahman', sex: 'Macho', birthDate: new Date('2022-08-05'), weight: 550 },
  ];

  constructor() { }

  getAnimals(): Observable<Animal[]> {
    return of(this.mockAnimals);
  }

  getAnimalById(id: string): Observable<Animal | undefined> {
    const animal = this.mockAnimals.find(a => a.id === id);
    return of(animal);
  }

  create(animal: Omit<Animal, 'id'>): Observable<Animal> {
    const newAnimal: Animal = {
      id: uuidv4(),
      ...animal
    };
    this.mockAnimals.push(newAnimal);
    return of(newAnimal);
  }

  update(animal: Animal): Observable<Animal> {
    const index = this.mockAnimals.findIndex(a => a.id === animal.id);
    if (index > -1) {
      this.mockAnimals[index] = animal;
    }
    return of(animal);
  }

  delete(id: string): Observable<void> {
    const index = this.mockAnimals.findIndex(a => a.id === id);
    if (index > -1) {
      this.mockAnimals.splice(index, 1);
    }
    return of(undefined);
  }
}
