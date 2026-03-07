import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { TenantService } from '../../services/tenant.service';
import { TenantConfig } from '../../models/tenant-config.model';
import { ModalService } from '../../../../shared/services/modal.service';
import { TenantsFormComponent } from '../tenants-form/tenants-form.component';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tenants-list.component.html',
  styleUrl: './tenants-list.component.css'
})
export class TenantsListComponent implements OnInit {
  tenants: TenantConfig[] = [];
  filteredTenants: TenantConfig[] = [];
  searchControl = new FormControl('');
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly tenantService: TenantService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(200), distinctUntilChanged())
      .subscribe((term) => this.filter(term ?? ''));

    this.loadTenants();
  }

  loadTenants(): void {
    this.loading = true;
    this.errorMessage = '';
    this.tenantService.getTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants;
        this.filteredTenants = tenants;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Nao foi possivel carregar os tenants.';
      }
    });
  }

  filter(term: string): void {
    const normalized = term.toLowerCase().trim();
    if (!normalized) {
      this.filteredTenants = [...this.tenants];
      return;
    }
    this.filteredTenants = this.tenants.filter((tenant) =>
      tenant.tenantKey.toLowerCase().includes(normalized) ||
      (tenant.url || '').toLowerCase().includes(normalized)
    );
  }

  novoTenant(): void {
    const ref = this.modalService.open({
      component: TenantsFormComponent,
      title: 'Novo Tenant',
      modalStyle: 'lg',
    });

    ref?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Tenant salvo com sucesso.';
        this.loadTenants();
      }
    });
  }

  editarTenant(tenant: TenantConfig): void {
    const ref = this.modalService.open({
      component: TenantsFormComponent,
      title: 'Editar Tenant',
      object: tenant,
      modalStyle: 'lg',
    });

    ref?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Tenant atualizado com sucesso.';
        this.loadTenants();
      }
    });
  }

  excluirTenant(tenant: TenantConfig): void {
    if (!confirm(`Deseja remover o tenant "${tenant.tenantKey}"?`)) {
      return;
    }
    this.tenantService.deleteTenant(tenant.tenantKey).subscribe({
      next: () => {
        this.successMessage = 'Tenant removido com sucesso.';
        this.loadTenants();
      },
      error: () => {
        this.errorMessage = 'Nao foi possivel remover o tenant.';
      }
    });
  }
}
