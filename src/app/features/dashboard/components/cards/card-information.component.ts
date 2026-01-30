import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-information',
  standalone: true,
  imports: [],
  templateUrl: './card-information.component.html',
  styleUrl: './card-information.component.css'
})
export class CardInformationComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() value: string = '';
}
