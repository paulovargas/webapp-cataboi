import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';
import { RouteModalMapperService } from '../../../../shared/services/route-modal-mapper.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  /**
   *
   */
  constructor(
    private modalService: ModalService,
    private routeMapper: RouteModalMapperService,
    private authService: AuthService,
    private router: Router
  ) {}

  get userDisplayName(): string {
    return this.authService.getCurrentUser()?.nome || 'Usuario';
  }

  get isAnyAdmin(): boolean {
    return this.authService.isAnyAdmin();
  }

  get isSystemAdmin(): boolean {
    return this.authService.isSystemAdmin();
  }

  get roleLabel(): string {
    const role = this.authService.getCurrentUser()?.role;
    if (role === 'SYSTEM_ADMIN') {
      return 'SYSTEM_ADMIN';
    }
    if (role === 'CLIENT_ADMIN') {
      return 'CLIENT_ADMIN';
    }
    return 'CLIENT_USER';
  }

  openModal(route: string){
    const config = this.routeMapper.getModalConfig(route);

    console.log("Componente : ", config);


    if (config) {
      // Se a rota for encontrada no mapa e tiver as propriedades de modal
      //this.modalService.open();
    } else {
      // Comportamento default se a rota não for encontrada ou não tiver a metadata de modal
      //this.modalService.openModal(rota, '', '');
      alert("Rota Não encontrada !");
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }



}
