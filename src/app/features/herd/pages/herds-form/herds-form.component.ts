import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Herd } from '../../models/herd.model';
import { HerdService } from '../../services/herd.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-herds-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './herds-form.component.html',
  styleUrls: ['./herds-form.component.css']
})
export class HerdsFormComponent implements OnInit {
  herd: Herd | null = null;
  herdForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private herdService: HerdService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.herdForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.herdService.getHerdById(+id).subscribe(herd => {
        if (herd) {
          this.herd = herd;
          this.herdForm.patchValue(this.herd);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.herdForm.valid) {
      const formData = this.herdForm.value;
      if (this.isEditMode && this.herd) {
        this.herdService.update({ ...this.herd, ...formData }).subscribe(() => {
          this.router.navigate(['/rebanhos']);
        });
      } else {
        this.herdService.create(formData).subscribe(() => {
          this.router.navigate(['/rebanhos']);
        });
      }
    }
  }
}