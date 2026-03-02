import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ModalService } from '../../../../shared/services/modal.service';
import { EventsFormComponent } from '../events-form/events-form.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.css'
})
export class EventsListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchControl = new FormControl('');
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;

  constructor(
    private readonly eventService: EventService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(term => {
      this.filterEvents(term || '');
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents(this.page, this.size).subscribe({
      next: (page) => {
        this.events = page.content;
        this.filteredEvents = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterEvents(term: string): void {
    const lowerCaseTerm = term.toLowerCase();
    this.filteredEvents = this.events.filter(event =>
      event.nome.toLowerCase().includes(lowerCaseTerm) ||
      (event.descri ?? '').toLowerCase().includes(lowerCaseTerm)
    );
  }

  adicionarEvento(): void {
    const dialogRef = this.modalService.open({
      component: EventsFormComponent,
      title: 'Adicionar Evento',
      modalStyle: 'lg',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadEvents());
  }

  editarEvento(event: Event): void {
    const dialogRef = this.modalService.open({
      component: EventsFormComponent,
      title: 'Detalhes do Evento',
      object: event,
      modalStyle: 'lg',
    });
    dialogRef?.afterClosed().subscribe(() => this.loadEvents());
  }

  deleteEvent(id: number): void {
    if (!confirm('Deseja realmente excluir este evento?')) {
      return;
    }

    this.eventService.delete(id).subscribe(() => {
      this.loadEvents();
    });
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }
    this.page--;
    this.loadEvents();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }
    this.page++;
    this.loadEvents();
  }
}
