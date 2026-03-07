import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="crud-form-shell">
      <h3 class="crud-form-title">{{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}</h3>
      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
        <div class="crud-form-grid">
          <div class="crud-form-group">
            <label for="nomeCliente">Nome</label>
            <input id="nomeCliente" class="form-control" formControlName="nomeCliente" />
          </div>
          <div class="crud-form-group">
            <label for="email">Email</label>
            <input id="email" class="form-control" formControlName="email" />
          </div>
          <div class="crud-form-group">
            <label for="telefone">Telefone</label>
            <input id="telefone" class="form-control" formControlName="telefone" />
          </div>
          <div class="crud-form-group">
            <label for="cpfCnpj">CPF/CNPJ</label>
            <input id="cpfCnpj" class="form-control" formControlName="cpfCnpj" />
          </div>
          <div class="crud-form-group">
            <label for="inscricaoEst">Inscricao Estadual</label>
            <input id="inscricaoEst" class="form-control" formControlName="inscricaoEst" />
          </div>
          <div class="crud-form-group">
            <label for="numUsuarios">Numero de Usuarios</label>
            <input id="numUsuarios" type="number" class="form-control" formControlName="numUsuarios" />
          </div>
          <div class="crud-form-group">
            <label for="tenantKey">Tenant Key</label>
            <input id="tenantKey" class="form-control" formControlName="tenantKey" />
          </div>
          <div class="crud-form-group">
            <label for="endereco">Endereco</label>
            <input id="endereco" class="form-control" formControlName="endereco" />
          </div>
          <div class="crud-form-group">
            <label for="cidade">Cidade</label>
            <input id="cidade" class="form-control" formControlName="cidade" />
          </div>
          <div class="crud-form-group">
            <label for="estado">Estado</label>
            <input id="estado" class="form-control" formControlName="estado" />
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger py-2 mt-2">{{ errorMessage }}</div>

        <div class="crud-form-actions">
          <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="customerForm.invalid || saving">
            {{ saving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Salvar') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class CustomersFormComponent implements OnInit {
  private current?: Customer;

  customerForm: FormGroup;
  isEditMode = false;
  saving = false;
  errorMessage = '';

  public set dados(value: Customer | undefined) {
    if (!value) {
      return;
    }

    this.current = value;
    this.isEditMode = true;
    this.customerForm.patchValue(value);
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly modalService: ModalService
  ) {
    this.customerForm = this.fb.group({
      id: [null],
      nomeCliente: ['', Validators.required],
      endereco: [''],
      cidade: [''],
      estado: [''],
      telefone: [''],
      email: [''],
      cpfCnpj: [''],
      inscricaoEst: [''],
      numUsuarios: [null],
      tenantKey: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.customerForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    const payload = this.customerForm.value as Customer;

    const request$ = this.isEditMode
      ? this.customerService.update({ ...this.current, ...payload } as Customer)
      : this.customerService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.modalService.close(true);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Nao foi possivel salvar o cliente.';
      }
    });
  }

  cancel(): void {
    this.modalService.close();
  }
}
