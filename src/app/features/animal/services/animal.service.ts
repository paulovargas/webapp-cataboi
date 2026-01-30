import { Page } from './../../../core/models/page.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  /* private mockAnimals: Animal[] = [
    { id: '1', name: 'Mimosa', breed: 'Nelore', sex: 'Fêmea', birthDate: new Date('2022-01-15'), weight: 450 },
    { id: '2', name: 'Valente', breed: 'Angus', sex: 'Macho', birthDate: new Date('2021-11-20'), weight: 600 },
    { id: '3', name: 'Estrela', breed: 'Girolando', sex: 'Fêmea', birthDate: new Date('2023-03-10'), weight: 300 },
    { id: '4', name: 'Trovão', breed: 'Brahman', sex: 'Macho', birthDate: new Date('2022-08-05'), weight: 550 },
  ]; */

  private readonly apiUrl = 'http://localhost:8080/animais';

  private readonly mockAnimals: Animal[] = [];

  constructor(private readonly http: HttpClient) { }

  getAnimals(page = 0, size = 10): Observable<Page<Animal>> {
    return this.http.get<Page<Animal>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

 /* getAnimalById(id: string): Observable<Animal | undefined> {
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
  } */
}
