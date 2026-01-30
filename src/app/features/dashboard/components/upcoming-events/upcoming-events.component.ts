import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent {
  events = [
    { date: '2026-01-25', name: 'Vacinação Lote A' },
    { date: '2026-02-01', name: 'Pesagem Lote B' },
    { date: '2026-02-10', name: 'Transferência Rebanho C' }
  ];
}
