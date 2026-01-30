import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Herd } from '../models/herd.model';
import { Page } from '../../../core/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class HerdService {

  private readonly apiUrl = 'http://localhost:8080/rebanhos';

  constructor(private readonly http: HttpClient) {}

  getHerds(page = 0, size = 10): Observable<Page<Herd>> {
  return this.http.get<Page<Herd>>(
    `${this.apiUrl}?page=${page}&size=${size}`
  );
}

  getHerdById(id: number): Observable<Herd> {
    return this.http.get<Herd>(`${this.apiUrl}/${id}`);
  }

  create(herd: Omit<Herd, 'id'>): Observable<Herd> {
    return this.http.post<Herd>(this.apiUrl, herd);
  }

  update(herd: Herd): Observable<Herd> {
    return this.http.put<Herd>(`${this.apiUrl}/${herd.id}`, herd);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
