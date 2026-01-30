import { Injectable, Type } from '@angular/core';
import { Router, Routes, Route } from '@angular/router';

interface ModalConfig {
  component: Type<any>;
  title: string;
  style: string;
}

@Injectable({
  providedIn: 'root',
})
export class RouteModalMapperService {
  private routeMap = new Map<string, ModalConfig>();

  constructor(private router: Router) {
    // A configuração de rotas (this.router.config) já deve estar completa aqui
    // se você NÃO estiver usando lazy loading.
    this.buildRouteMap(this.router.config);
  }

  /**
   * Função recursiva para percorrer as rotas e construir o mapa.
   * @param routes - Array de rotas a ser processado.
   */
  private buildRouteMap(routes: Routes) {
    for (const route of routes) {

      // 1. Mapear Rotas com Componentes (Para uso direto no modal)
      if (route.path && route.component && route.data && route.data['isModal']) {

        // Verifica se todas as informações necessárias estão presentes
        if (route.data['title'] && route.data['modalStyle']) {
          this.routeMap.set(route.path, {
            component: route.component as Type<any>,
            title: route.data['title'],
            style: route.data['modalStyle'],
          });
        }
      }

      // 2. Mapear Rotas Carregadas de Forma Lazy ( loadChildren )
      // ATENÇÃO: Se você usa 'loadChildren', o componente não estará em 'route.component'
      // O tratamento de rotas lazy é mais complexo, pois exige que o módulo seja
      // carregado para ter acesso à rota interna. Se este for seu caso,
      // a refatoração para um objeto de mapeamento manual (como no meu primeiro
      // exemplo) PODE ser mais simples do que forçar o carregamento do módulo.

      // 3. Verifica rotas filhas
      if (route.children) {
        this.buildRouteMap(route.children);
      }
    }
  }

  getModalConfig(path: string): ModalConfig | undefined {
    return this.routeMap.get(path);
  }
}
