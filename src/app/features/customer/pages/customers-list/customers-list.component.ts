import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { CustomersFormComponent } from '../customers-form/customers-form.component';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css'
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchControl = new FormControl('');
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly customerService: CustomerService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(200), distinctUntilChanged())
      .subscribe((term) => this.filterCustomers(term ?? ''));
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.customerService.getCustomers(this.page, this.size).subscribe({
      next: (pageData) => {
        this.customers = pageData.content;
        this.filteredCustomers = pageData.content;
        this.totalPages = pageData.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar clientes.';
      }
    });
  }

  filterCustomers(term: string): void {
    const normalized = term.toLowerCase().trim();
    if (!normalized) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    this.filteredCustomers = this.customers.filter((customer) =>
      (customer.nomeCliente || '').toLowerCase().includes(normalized)
      || (customer.email || '').toLowerCase().includes(normalized)
      || (customer.cidade || '').toLowerCase().includes(normalized)
    );
  }

  adicionarCliente(): void {
    const ref = this.modalService.open({
      component: CustomersFormComponent,
      title: 'Novo Cliente',
      modalStyle: 'lg',
    });
    ref?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Cliente salvo com sucesso.';
        this.loadCustomers();
      }
    });
  }

  editarCliente(customer: Customer): void {
    const ref = this.modalService.open({
      component: CustomersFormComponent,
      title: 'Editar Cliente',
      object: customer,
      modalStyle: 'lg',
    });
    ref?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Cliente atualizado com sucesso.';
        this.loadCustomers();
      }
    });
  }

  deleteCliente(customer: Customer): void {
    if (!customer.id) {
      return;
    }
    if (!confirm(`Deseja realmente excluir o cliente "${customer.nomeCliente}"?`)) {
      return;
    }
    this.customerService.delete(customer.id).subscribe({
      next: () => {
        this.successMessage = 'Cliente excluido com sucesso.';
        this.loadCustomers();
      },
      error: () => {
        this.errorMessage = 'Nao foi possivel excluir o cliente.';
      }
    });
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }
    this.page--;
    this.loadCustomers();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }
    this.page++;
    this.loadCustomers();
  }
}
