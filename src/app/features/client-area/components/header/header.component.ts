import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';
import { RouteModalMapperService } from '../../../../shared/services/route-modal-mapper.service';

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
    private routeMapper: RouteModalMapperService
  ) {}

  openModal(route: string){
    const config = this.routeMapper.getModalConfig(route);

    console.log("Componente : ", config);


    if (config) {
      // Se a rota for encontrada no mapa e tiver as propriedades de modal
      this.modalService.open(
        config.component, // Componente extraído da rota
        '',
        config.style,     // Estilo extraído da rota (via 'data')
        config.title,     // Título extraído da rota (via 'data')
        '',
        '',
        ''
      );
    } else {
      // Comportamento default se a rota não for encontrada ou não tiver a metadata de modal
      //this.modalService.openModal(rota, '', '');
      alert("Rota Não encontrada !");
    }
  }



}
