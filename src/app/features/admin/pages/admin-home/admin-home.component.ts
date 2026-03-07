import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../../user/services/user.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { TenantService } from '../../../tenant/services/tenant.service';
import { Customer } from '../../../customer/models/customer.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
  loading = false;
  errorMessage = '';

  totalUsers = 0;
  totalCustomers = 0;
  totalTenants = 0;
  totalSystemAdmins = 0;
  totalClientAdmins = 0;
  totalClientUsers = 0;
  customersSnapshot: Customer[] = [];

  ngOnInit(): void {
    this.loadSummary();
  }

  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly tenantService: TenantService
  ) {}

  loadSummary(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      usersPage: this.userService.getUsers(0, 200).pipe(catchError(() => of(null))),
      customersPage: this.customerService.getCustomers(0, 8).pipe(catchError(() => of(null))),
      tenants: this.tenantService.getTenants().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ usersPage, customersPage, tenants }) => {
        this.totalUsers = usersPage?.totalElements ?? 0;
        this.totalCustomers = customersPage?.totalElements ?? 0;
        this.totalTenants = tenants.length;
        this.customersSnapshot = customersPage?.content ?? [];
        this.calculateRoleBreakdown(usersPage?.content ?? []);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Nao foi possivel carregar o painel administrativo.';
      },
    });
  }

  private calculateRoleBreakdown(users: User[]): void {
    let systemAdmin = 0;
    let clientAdmin = 0;
    let clientUser = 0;

    for (const user of users) {
      const role = user.role ?? (user.master ? (user.cliente?.id ? 'CLIENT_ADMIN' : 'SYSTEM_ADMIN') : 'CLIENT_USER');
      if (role === 'SYSTEM_ADMIN') {
        systemAdmin++;
      } else if (role === 'CLIENT_ADMIN') {
        clientAdmin++;
      } else {
        clientUser++;
      }
    }

    this.totalSystemAdmins = systemAdmin;
    this.totalClientAdmins = clientAdmin;
    this.totalClientUsers = clientUser;
  }
}
