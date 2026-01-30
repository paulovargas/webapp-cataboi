import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Herd } from '../models/herd.model';

@Injectable({
  providedIn: 'root'
})
export class HerdService {
  private herds: Herd[] = [
    { id: 1, name: 'Gado de corte', description: 'Gado para abate' },
    { id: 2, name: 'Gado de leite', description: 'Gado para produção de leite' }
  ];
  private nextId = 3;

  getHerds(): Observable<Herd[]> {
    return of(this.herds);
  }

  getHerdById(id: number): Observable<Herd | undefined> {
    const herd = this.herds.find(h => h.id === id);
    return of(herd);
  }

  create(herd: Omit<Herd, 'id'>): Observable<Herd> {
    const newHerd: Herd = {
      id: this.nextId++,
      ...herd
    };
    this.herds.push(newHerd);
    return of(newHerd);
  }

  update(herd: Herd): Observable<Herd> {
    const index = this.herds.findIndex(h => h.id === herd.id);
    if (index > -1) {
      this.herds[index] = herd;
    }
    return of(herd);
  }

  delete(id: number): Observable<void> {
    const index = this.herds.findIndex(h => h.id === id);
    if (index > -1) {
      this.herds.splice(index, 1);
    }
    return of(undefined);
  }
}
