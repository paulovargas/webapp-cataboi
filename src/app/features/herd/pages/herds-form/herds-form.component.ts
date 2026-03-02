import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Herd } from '../../models/herd.model';
import { HerdService } from '../../services/herd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-herds-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './herds-form.component.html',
  styleUrls: ['./herds-form.component.css']
})
export class HerdsFormComponent implements OnInit {
  private _dados?: Herd;
  herdForm: FormGroup;
  isEditMode = false;

  public set dados(value: Herd | undefined) {
    if (!value) {
      return;
    }

    this._dados = value;
    this.isEditMode = true;
    this.herdForm.patchValue(value);
  }

  constructor(
    private fb: FormBuilder,
    private herdService: HerdService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly modalService: ModalService
  ) {
    this.herdForm = this.fb.group({
      id: [null],
      nomeRebanho: ['', Validators.required],
      descriRebanho: [''],
    });
  }

  ngOnInit(): void {
    if (this._dados) {
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.herdService.getHerdById(+id).subscribe(herd => {
        if (herd) {
          this._dados = herd;
          this.herdForm.patchValue(herd);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.herdForm.valid) {
      const formData = this.herdForm.value;
      if (this._dados) {
        this.herdService.update({ ...this._dados, ...formData }).subscribe(() => {
          this.modalService.close(true);
          this.router.navigate(['/rebanhos']);
        });
      } else {
        this.herdService.create(formData).subscribe(() => {
          this.modalService.close(true);
          this.router.navigate(['/rebanhos']);
        });
      }
    }
  }
}
