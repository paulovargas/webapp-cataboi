import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TenantService } from '../../services/tenant.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { TenantConfig } from '../../models/tenant-config.model';

@Component({
  selector: 'app-tenants-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="crud-form-shell">
      <h3 class="crud-form-title">{{ isEditMode ? 'Editar Tenant' : 'Novo Tenant' }}</h3>
      <form [formGroup]="tenantForm" (ngSubmit)="onSubmit()">
        <div class="crud-form-grid">
          <div class="crud-form-group">
            <label for="tenantKey">Tenant Key</label>
            <input id="tenantKey" class="form-control" formControlName="tenantKey" [readonly]="isEditMode" />
          </div>
          <div class="crud-form-group">
            <label for="url">JDBC URL</label>
            <input id="url" class="form-control" formControlName="url" />
          </div>
          <div class="crud-form-group">
            <label for="username">Username</label>
            <input id="username" class="form-control" formControlName="username" />
          </div>
          <div class="crud-form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              class="form-control"
              formControlName="password"
              [placeholder]="isEditMode ? 'Deixe em branco para manter a senha atual' : ''"
            />
          </div>
          <div class="crud-form-group">
            <label for="driverClassName">Driver Class</label>
            <input id="driverClassName" class="form-control" formControlName="driverClassName" />
          </div>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger py-2 mt-2">{{ errorMessage }}</div>

        <div class="crud-form-actions">
          <button type="button" class="btn btn-outline-secondary" (click)="cancel()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="tenantForm.invalid || saving">
            {{ saving ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Salvar') }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class TenantsFormComponent {
  private current?: TenantConfig;
  tenantForm: FormGroup;
  isEditMode = false;
  saving = false;
  errorMessage = '';

  public set dados(value: TenantConfig | undefined) {
    if (!value) {
      return;
    }
    this.current = value;
    this.isEditMode = true;
    this.tenantForm.patchValue({
      tenantKey: value.tenantKey,
      url: value.url,
      username: value.username,
      password: '',
      driverClassName: value.driverClassName || 'com.mysql.cj.jdbc.Driver'
    });
    this.tenantForm.get('password')?.clearValidators();
    this.tenantForm.get('password')?.updateValueAndValidity();
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly tenantService: TenantService,
    private readonly modalService: ModalService
  ) {
    this.tenantForm = this.fb.group({
      tenantKey: ['', Validators.required],
      url: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      driverClassName: ['com.mysql.cj.jdbc.Driver', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.tenantForm.invalid || this.saving) {
      return;
    }
    this.saving = true;
    this.errorMessage = '';

    const payload = this.tenantForm.value as TenantConfig;
    const request$ = this.isEditMode
      ? this.tenantService.updateTenant({ ...this.current, ...payload } as TenantConfig)
      : this.tenantService.createTenant(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.modalService.close(true);
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Nao foi possivel salvar o tenant.';
      }
    });
  }

  cancel(): void {
    this.modalService.close();
  }
}
