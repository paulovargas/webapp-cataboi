import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    { id: 1, name: 'Vacinação', date: new Date(), description: 'Vacinação contra febre aftosa' },
    { id: 2, name: 'Pesagem', date: new Date(), description: 'Pesagem de todos os animais' }
  ];

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }
}
