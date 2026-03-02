import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, effect, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
export class ModalContentDialog implements OnInit, AfterViewInit {

  modalStyle: string = 'md';
  myString!: string;
  titulo?: string;
  urlBase: string = '';
  urlAux: string = '';
  parametro!: string;

  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { component?: any, object?: any, modalStyle?: string, title?: string, codUF?: string, id?: string},
    private readonly dialogRef: MatDialogRef<ModalContentDialog>,
    private readonly elRef: ElementRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {

    effect(() => {
      this.modalStyle = this.data?.modalStyle ? this.data.modalStyle : 'md';
      this.titulo = this.data?.title ? this.data?.title : '';
    })
  }

  ngOnInit(): void {
    // no-op
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.data?.component) {
        if (!this.titulo) {
          this.titulo = this.data.title;
        }

        this.container.clear();
        this.componentRef = this.container.createComponent(this.data.component);
        if (this.componentRef?.instance) {
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

  get sizeClass(): string {
    if (this.modalStyle === 'lg') {
      return 'size-lg';
    }
    if (this.modalStyle === 'sm') {
      return 'size-sm';
    }
    return 'size-md';
  }

  close(): void {
    this.dialogRef.close();
  }
}

