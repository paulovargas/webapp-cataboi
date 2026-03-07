import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user/services/user.service';
import { AuthService } from '../../core/auth/auth.service';
import { ClientData } from '../user/models/user.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
  profileForm: FormGroup;
  cliente: ClientData | null = null;
  loading = false;
  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    this.profileForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getMe().subscribe({
      next: (user) => {
        this.cliente = user.cliente ?? null;
        this.profileForm.patchValue({
          nome: user.nome,
          email: user.email,
          senha: '',
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Nao foi possivel carregar o perfil.';
      },
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.profileForm.value;
    if (!payload.senha) {
      delete payload.senha;
    }

    this.userService.updateMe(payload).subscribe({
      next: (updated) => {
        const current = this.authService.getCurrentUser();
        this.authService.setCurrentUser({
          nome: updated.nome,
          email: updated.email,
          master: current?.master,
          role: current?.role,
        });
        this.profileForm.patchValue({ senha: '' });
        this.saving = false;
        this.successMessage = 'Perfil atualizado com sucesso.';
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Nao foi possivel atualizar o perfil.';
      },
    });
  }

  display(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return String(value);
  }
}
