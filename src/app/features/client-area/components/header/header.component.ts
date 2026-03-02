import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';
import { RouteModalMapperService } from '../../../../shared/services/route-modal-mapper.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
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
