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
import { AuthService } from '../../../../core/auth/auth.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { Customer } from '../../../customer/models/customer.model';

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

          <div class="crud-form-group">
            <label for="role">Perfil</label>
            <select id="role" class="form-select" formControlName="role">
              <option value="CLIENT_USER">Usuario do Cliente</option>
              <option value="CLIENT_ADMIN">Administrador do Cliente</option>
              <option *ngIf="isSystemAdmin" value="SYSTEM_ADMIN">Administrador do Sistema (Cataboi)</option>
            </select>
          </div>

          <div class="crud-form-group" *ngIf="isSystemAdmin && userForm.get('role')?.value !== 'SYSTEM_ADMIN'">
            <label for="clienteId">Cliente</label>
            <select id="clienteId" class="form-select" formControlName="clienteId">
              <option [ngValue]="null">Selecione um cliente</option>
              <option *ngFor="let customer of customers" [ngValue]="customer.id">
                {{ customer.nomeCliente }}
              </option>
            </select>
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
  isSystemAdmin = false;
  customers: Customer[] = [];

  public set dados(value: User | undefined) {
    if (!value) {
      return;
    }

    this._dados = value;
    this.isEditMode = true;
    const fallbackRole = value.master
      ? (value.cliente?.id ? 'CLIENT_ADMIN' : 'SYSTEM_ADMIN')
      : 'CLIENT_USER';
    this.userForm.patchValue({
      idusu: value.idusu,
      nome: value.nome,
      email: value.email,
      role: value.role ?? fallbackRole,
      clienteId: value.cliente?.id ?? null,
      senha: '',
    });

    const senhaControl = this.userForm.get('senha');
    senhaControl?.clearValidators();
    senhaControl?.updateValueAndValidity();
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly modalService: ModalService,
    private readonly authService: AuthService,
    private readonly customerService: CustomerService
  ) {
    this.userForm = this.fb.group({
      idusu: [null],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required],
      role: ['CLIENT_USER', Validators.required],
      clienteId: [null],
    });
  }

  ngOnInit(): void {
    this.isSystemAdmin = this.authService.isSystemAdmin();
    if (this.isSystemAdmin) {
      this.loadCustomers();
    }

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      const clienteControl = this.userForm.get('clienteId');
      if (!clienteControl) {
        return;
      }

      if (this.isSystemAdmin && role !== 'SYSTEM_ADMIN') {
        clienteControl.setValidators([Validators.required]);
      } else {
        clienteControl.clearValidators();
      }
      clienteControl.updateValueAndValidity();
    });

    const currentRole = this.userForm.get('role')?.value;
    if (this.isSystemAdmin && currentRole !== 'SYSTEM_ADMIN') {
      this.userForm.get('clienteId')?.setValidators([Validators.required]);
      this.userForm.get('clienteId')?.updateValueAndValidity();
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers(0, 200).subscribe({
      next: (page) => {
        this.customers = page.content;
      },
      error: () => {
        this.errorMessage = 'Nao foi possivel carregar os clientes.';
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;
    const role = formValue.role as 'SYSTEM_ADMIN' | 'CLIENT_ADMIN' | 'CLIENT_USER';
    const payload: User = {
      ...(this._dados ?? {}),
      idusu: formValue.idusu,
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      role,
      master: role === 'SYSTEM_ADMIN' || role === 'CLIENT_ADMIN',
      cliente: role === 'SYSTEM_ADMIN'
        ? null
        : (formValue.clienteId ? { id: Number(formValue.clienteId) } : undefined),
    };

    if (this._dados) {
      this.userService.update(payload).subscribe({
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

    this.userService.create(payload).subscribe({
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
