import { Page } from './../../../core/models/page.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  private readonly apiUrl = `${environment.apiUrl}/animais`;

  private readonly mockAnimals: Animal[] = [];

  constructor(private readonly http: HttpClient) { }

  getAnimals(page = 0, size = 10): Observable<Page<Animal>> {
    return this.http.get<Page<Animal>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  createAnimal(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.apiUrl, animal);
  }

  updateAnimal(animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${animal.idanimal}`, animal);
  }

  deleteAnimal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
