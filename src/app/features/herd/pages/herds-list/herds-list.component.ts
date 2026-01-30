import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Herd } from '../../models/herd.model';
import { HerdService } from '../../services/herd.service';

@Component({
  selector: 'app-herds-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './herds-list.component.html',
  styleUrl: './herds-list.component.css'
})
export class HerdsListComponent implements OnInit {
  herds: Herd[] = [];

  constructor(private herdService: HerdService) {}

  ngOnInit(): void {
    this.herdService.getHerds().subscribe(data => {
      this.herds = data;
    });
  }
}
