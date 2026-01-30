import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalContentDialog } from '../components/modal/modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private dialogRef: MatDialogRef<ModalContentDialog> | null = null;
  private dialogRefs: MatDialogRef<any>[] = [];

  constructor(
    private dialog: MatDialog,
    private router: Router
  ) { }

  open(component: any, object: any, modalStyle: string, title: string, codUF: string, id: string, chave: string): void {
      this.dialogRef = this.dialog.open(ModalContentDialog, {
        data: {
          component,
          object,
          modalStyle,
          title,
          codUF,
          id,
          chave
        },
        disableClose: false,
       });
    this.dialogRef?.afterClosed().subscribe( () => {
      this.dialogRef = null;
    });
    this.dialogRefs.push(this.dialogRef);
  }
}
