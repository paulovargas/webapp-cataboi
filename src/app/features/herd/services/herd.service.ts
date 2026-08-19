import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Herd } from '../models/herd.model';
import { Page } from '../../../core/models/page.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HerdService {

  private readonly apiUrl = `${environment.apiUrl}/rebanhos`;

  constructor(private readonly http: HttpClient) {}

  getHerds(page = 0, size = 10): Observable<Page<Herd>> {
    if (environment.useMockAuth) {
      return of(this.buildMockPage(page, size));
    }

    return this.http.get<Page<Herd>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    ).pipe(catchError(() => of(this.buildMockPage(page, size))));
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

  private buildMockPage(page: number, size: number): Page<Herd> {
    const content: Herd[] = [
      { id: 1, nomeRebanho: 'Nelore matriz', descriRebanho: 'Matrizes em reproducao', nomeCliente: 'CataBoi Demo', quantidadeAnimais: 124 },
      { id: 2, nomeRebanho: 'Bezerros 2026', descriRebanho: 'Lote de cria do ano', nomeCliente: 'CataBoi Demo', quantidadeAnimais: 78 },
      { id: 3, nomeRebanho: 'Engorda intensiva', descriRebanho: 'Animais em terminacao', nomeCliente: 'CataBoi Demo', quantidadeAnimais: 96 },
    ];

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      number: page,
      size,
      first: true,
      last: true,
      empty: content.length === 0,
    };
  }
}
