import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, effect, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.css',
  imports: []
})
export class ModalComponent {}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
  styleUrl: 'dialog.css',
  imports: [
    CommonModule,
    RouterOutlet
  ]
})
export class ModalContentDialog implements OnInit, AfterViewInit, OnDestroy {

  modalStyle: string = '160vh';
  myString!: string;
  titulo?: string;
  urlBase: string = '';
  urlAux: string = '';
  parametro!: string;

  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { component?: any, object?: any, modalStyle: string, title?: string, codUF: string, id: string},
    private dialogRef: MatDialogRef<ModalContentDialog>,
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router
  ) {

    effect(() => {
      this.modalStyle = this.data?.modalStyle ? data.modalStyle : '160vh';
      this.titulo = data?.title ? data?.title : '';
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data?.component) {
        console.log("Componente : ",this.data?.component);
        if (!this.titulo) {
          this.titulo = this.data.title;
        }

        this.container.clear();
        this.componentRef = this.container.createComponent(this.data.component);
        if (this.componentRef && this.componentRef.instance) {
          if (this.data.object && this.componentRef.instance) {
            this.componentRef.instance.dados = this.data.object;
          }
        }
        else {
          console.error('Erro ao criar componente dinâmico');
        }
      }

    });
  }

  ngOnDestroy(): void { }

}

