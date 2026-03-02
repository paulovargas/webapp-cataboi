import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-events-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="crud-form-shell">
      <h3 class="crud-form-title">{{ isEditMode ? 'Editar Evento' : 'Novo Evento' }}</h3>

      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
        <div class="crud-form-grid">
          <div class="crud-form-group">
            <label for="nome">Nome do Evento</label>
            <input type="text" id="nome" class="form-control" formControlName="nome" />
          </div>

          <div class="crud-form-group">
            <label for="dataEvento">Data</label>
            <input type="date" id="dataEvento" class="form-control" formControlName="dataEvento" />
          </div>
        </div>

        <div class="crud-form-group mt-2">
          <label for="descri">Descricao</label>
          <textarea id="descri" class="form-control" formControlName="descri"></textarea>
        </div>

        <div class="crud-form-actions">
          <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="eventForm.invalid">
            {{ isEditMode ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EventsFormComponent implements OnInit {
  private _dados?: Event;

  public set dados(value: Event | undefined) {
    if (value) {
      this._dados = value;
      this.isEditMode = true;
      const dataEvento = value.dataEvento
        ? String(value.dataEvento).split('T')[0]
        : '';
      this.eventForm.patchValue({
        idevenR: value.idevenR,
        nome: value.nome,
        dataEvento,
        descri: value.descri,
      });
    }
  }

  eventForm: FormGroup;
  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly eventService: EventService,
    private readonly modalService: ModalService
  ) {
    this.eventForm = this.fb.group({
      idevenR: [null],
      nome: ['', Validators.required],
      dataEvento: ['', Validators.required],
      descri: [''],
      local: [''],
      obser: [''],
      eventoGrupo: [0],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      if (this._dados) {
        this.eventService.update({ ...this._dados, ...formData }).subscribe(() => {
          this.modalService.close(true);
        });
      } else {
        this.eventService.create(formData).subscribe(() => {
          this.modalService.close(true);
        });
      }
    }
  }

  cancel(): void {
    this.modalService.close();
  }
}
