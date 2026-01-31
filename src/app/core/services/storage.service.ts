import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  totalAnimais = signal<number>(0);
  totalRebanhos = signal<number>(0);

  setTotalAnimais(total: number) {
    this.totalAnimais.set(total);
  }

  getTotalAnimais() {
    return this.totalAnimais();
  }

  setTotalRebanhos(total: number) {
    this.totalRebanhos.set(total);
  }

  getTotalRebanhos() {
    return this.totalRebanhos();
  }
}
