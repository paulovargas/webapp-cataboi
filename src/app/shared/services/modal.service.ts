import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ModalContentDialog } from "../components/modal/modal.component";
import { Router } from "@angular/router";
import { ModalOptions } from "../../core/models/modalOptions.model";

@Injectable({ providedIn: 'root' })
export class ModalService {

  private dialogRef?: MatDialogRef<ModalContentDialog>;

  constructor(
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  open(options: ModalOptions): MatDialogRef<ModalContentDialog> | undefined {

    // 🔒 evita abrir outro modal se já existir
    if (this.dialogRef) {
      return this.dialogRef;
    }

    this.dialogRef = this.dialog.open(ModalContentDialog, {
      data: options,
      disableClose: false,
      maxWidth: '98vw',
      width: 'auto',
      panelClass: 'crud-modal-panel'
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = undefined;
    });

    return this.dialogRef;
  }

  close(result?: unknown): void {
    this.dialogRef?.close(result);
  }
}
