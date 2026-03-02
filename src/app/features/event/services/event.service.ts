import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { Page } from '../../../core/models/page.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly apiUrl = `${environment.apiUrl}/eventos`;

  constructor(private readonly http: HttpClient) {}

  getEvents(page = 0, size = 10): Observable<Page<Event>> {
    return this.http.get<Page<Event>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  create(event: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  update(event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${event.idevenR}`, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
