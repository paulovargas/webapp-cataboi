import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchControl = new FormControl('');
  page = 0;
  size = 10;
  totalPages = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly userService: UserService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(200), distinctUntilChanged())
      .subscribe((term) => this.filterUsers(term ?? ''));

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUsers(this.page, this.size).subscribe({
      next: (pageData) => {
        this.users = pageData.content;
        this.filteredUsers = pageData.content;
        this.totalPages = pageData.totalPages;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar usuarios.';
        this.loading = false;
      },
    });
  }

  filterUsers(term: string): void {
    const normalized = term.toLowerCase().trim();
    if (!normalized) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter((user) =>
      user.nome.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized)
    );
  }

  adicionarUsuario(): void {
    const dialogRef = this.modalService.open({
      component: UsersFormComponent,
      title: 'Novo Usuario',
      modalStyle: 'md',
    });

    dialogRef?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Usuario salvo com sucesso.';
        this.loadUsers();
      }
    });
  }

  editarUsuario(user: User): void {
    const dialogRef = this.modalService.open({
      component: UsersFormComponent,
      title: 'Editar Usuario',
      object: user,
      modalStyle: 'md',
    });

    dialogRef?.afterClosed().subscribe((saved) => {
      if (saved) {
        this.successMessage = 'Usuario atualizado com sucesso.';
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Deseja realmente excluir este usuario?')) {
      return;
    }

    this.userService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Usuario excluido com sucesso.';
        this.loadUsers();
      },
      error: () => {
        this.errorMessage = 'Nao foi possivel excluir o usuario.';
      },
    });
  }

  previousPage(): void {
    if (this.page === 0 || this.loading) {
      return;
    }

    this.page--;
    this.loadUsers();
  }

  nextPage(): void {
    if (this.loading || this.page + 1 >= this.totalPages) {
      return;
    }

    this.page++;
    this.loadUsers();
  }
}
