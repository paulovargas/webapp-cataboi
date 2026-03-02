import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="crud-form-shell">
      <h3 class="crud-form-title">{{ isEditMode ? 'Editar Usuario' : 'Novo Usuario' }}</h3>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="crud-form-grid">
          <div class="crud-form-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" class="form-control" formControlName="nome" />
          </div>

          <div class="crud-form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" formControlName="email" />
          </div>

          <div class="crud-form-group">
            <label for="senha">Senha</label>
            <input
              type="password"
              id="senha"
              class="form-control"
              formControlName="senha"
              [placeholder]="isEditMode ? 'Deixe em branco para manter' : ''"
            />
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger py-2 mt-2">{{ errorMessage }}</div>

        <div class="crud-form-actions">
          <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid || saving">
            {{ saving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Salvar') }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class UsersFormComponent implements OnInit {
  private _dados?: User;

  userForm: FormGroup;
  isEditMode = false;
  saving = false;
  errorMessage = '';

  public set dados(value: User | undefined) {
    if (!value) {
      return;
    }

    this._dados = value;
    this.isEditMode = true;
    this.userForm.patchValue({
      idusu: value.idusu,
      nome: value.nome,
      email: value.email,
      senha: '',
    });

    const senhaControl = this.userForm.get('senha');
    senhaControl?.clearValidators();
    senhaControl?.updateValueAndValidity();
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly modalService: ModalService
  ) {
    this.userForm = this.fb.group({
      idusu: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const formData = this.userForm.value as User;

    if (this._dados) {
      this.userService.update({ ...this._dados, ...formData }).subscribe({
        next: () => {
          this.saving = false;
          this.modalService.close(true);
        },
        error: () => {
          this.saving = false;
          this.errorMessage = 'Falha ao atualizar usuario.';
        },
      });
      return;
    }

    this.userService.create(formData).subscribe({
      next: () => {
        this.saving = false;
        this.modalService.close(true);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Falha ao criar usuario.';
      },
    });
  }

  cancel(): void {
    this.modalService.close();
  }
}
