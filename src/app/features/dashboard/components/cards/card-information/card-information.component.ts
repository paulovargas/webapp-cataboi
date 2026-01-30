import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-information',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-information.component.html',
  styleUrl: './card-information.component.css'
})
export class CardInformationComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
}
