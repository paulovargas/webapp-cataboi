import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-properties-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="crud-form-shell">
      <h3 class="crud-form-title">{{ isEditMode ? 'Editar Propriedade' : 'Nova Propriedade' }}</h3>

      <form [formGroup]="propertyForm" (ngSubmit)="onSubmit()">
        <div class="crud-form-grid">
          <div class="crud-form-group">
            <label for="nomePropriedade">Nome da Propriedade</label>
            <input
              type="text"
              id="nomePropriedade"
              class="form-control"
              formControlName="nomePropriedade"
            />
          </div>

          <div class="crud-form-group">
            <label for="localidade">Localidade</label>
            <input type="text" id="localidade" class="form-control" formControlName="localidade" />
          </div>
        </div>

        <div class="crud-form-actions">
          <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="propertyForm.invalid">
            {{ isEditMode ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class PropertiesFormComponent implements OnInit {
  private _dados?: Property;

  public set dados(value: Property | undefined) {
    if (value) {
      this._dados = value;
      this.isEditMode = true;
      this.propertyForm.patchValue(value);
    }
  }

  propertyForm: FormGroup;
  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly propertyService: PropertyService,
    private readonly modalService: ModalService
  ) {
    this.propertyForm = this.fb.group({
      id: [null],
      nomePropriedade: ['', Validators.required],
      localidade: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.propertyForm.valid) {
      const formData = this.propertyForm.value;
      if (this._dados) {
        this.propertyService.update({ ...this._dados, ...formData }).subscribe(() => {
          this.modalService.close(true);
        });
      } else {
        this.propertyService.create(formData).subscribe(() => {
          this.modalService.close(true);
        });
      }
    }
  }

  cancel(): void {
    this.modalService.close();
  }
}
