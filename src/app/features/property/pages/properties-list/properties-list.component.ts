import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent implements OnInit {
  properties: Property[] = [];

  constructor(private readonly propertiesService: PropertyService) {}

  ngOnInit(): void {
    this.propertiesService.getProperties().subscribe({
      next: (page) => {
        this.properties = page.content;
      },
      error: (err) => console.error(err),
    });
  }
}
