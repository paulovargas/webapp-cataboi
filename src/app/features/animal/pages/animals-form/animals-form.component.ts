import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-animals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animals-form.component.html',
  styleUrls: ['./animals-form.component.css']
})
export class AnimalsFormComponent implements OnInit {
  animal: Animal | null = null;
  animalForm: FormGroup;
  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly animalService: AnimalService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.animalForm = this.fb.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      sex: ['Macho', Validators.required],
      birthDate: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    /* const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.animalService.getAnimalById(id).subscribe(animal => {
        if (animal) {
          this.animal = animal;
          this.animalForm.patchValue(this.animal);
        }
      });
    } */
  }

  onSubmit(): void {/*
    if (this.animalForm.valid) {
      const formData = this.animalForm.value;
      if (this.isEditMode && this.animal) {
        this.animalService.update({ ...this.animal, ...formData }).subscribe(() => {
          this.router.navigate(['/animais']);
        });
      } else {
        this.animalService.create(formData).subscribe(() => {
          this.router.navigate(['/animais']);
        });
      }
    }
   */}
}
