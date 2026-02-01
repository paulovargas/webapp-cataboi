import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-animals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animals-form.component.html',
  styleUrls: ['./animals-form.component.css'],
})
export class AnimalsFormComponent implements OnInit {
  private _dados?: Animal;

  public set dados(value: Animal | undefined) {
    if (value) {
      this._dados = value;
      this.isEditMode = true;
      this.animalForm.patchValue({
        idanimal: value.idanimal,
        rebanho: value.rebanho,
        propriedade: value.propriedade,
        especie: value.especie,
        numeroBrincos: value.numeroBrincos,
        dataNascimento: value.dataNascimento.split('T')[0],
        status: value.status,
        raca: value.raca,
        pelagem: value.pelagem,
        sexo: value.sexo,
        prenhez: value.prenhez,
        peso: value.peso,
        descricao: value.descricao,
      });
      console.log('Dados do animal:', value);
    }
  }

  animalForm: FormGroup;
  isEditMode = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly animalService: AnimalService,
    private readonly modalService: ModalService,
  ) {
    this.animalForm = this.fb.group({
      idanimal: [null],
      rebanho: [null, Validators.required],
      propriedade: [null, Validators.required],
      especie: ['', Validators.required],
      numeroBrincos: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      status: ['', Validators.required],
      raca: ['', Validators.required],
      pelagem: ['', Validators.required],
      sexo: ['Macho', Validators.required],
      prenhez: ['Nao'],
      peso: ['', [Validators.required, Validators.min(0)]],
      descricao: [''],
    });
  }

  ngOnInit(): void {
    // A lógica foi movida para o setter, então o ngOnInit fica limpo.
  }

  onSubmit(): void {
    if (this.animalForm.valid) {
      const formData = this.animalForm.value;

      // 3. Usa a propriedade privada '_dados' para a verificação de atualização
      /* if (this._dados) {
        this.animalService.update({ ...this._dados, ...formData }).subscribe(() => {
          this.modalService.close();
        });
      } else {
        this.animalService.create(formData).subscribe(() => {
          this.modalService.close();
        });
      } */
    }
  }

  cancel(): void {
    this.modalService.close();
  }
}