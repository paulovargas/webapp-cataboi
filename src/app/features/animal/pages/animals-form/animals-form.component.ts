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
import { Herd } from '../../../herd/models/herd.model';
import { Property } from '../../../property/models/property.model';
import { HerdService } from '../../../herd/services/herd.service';
import { PropertyService } from '../../../property/services/property.service';

@Component({
  selector: 'app-animals-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animals-form.component.html',
  styleUrls: ['./animals-form.component.css'],
})
export class AnimalsFormComponent implements OnInit {
  private _dados?: Animal;
  animalForm: FormGroup;
  isEditMode = false;
  herds: Herd[] = [];
  properties: Property[] = [];

  public set dados(value: Animal | undefined) {
    if (!value) {
      return;
    }

    this._dados = value;
    this.isEditMode = true;
    const dataNascimento = value.dataNascimento ? String(value.dataNascimento).split('T')[0] : '';

    this.animalForm.patchValue({
      idanimal: value.idanimal,
      rebanho: value.rebanho,
      propriedade: value.propriedade,
      especie: value.especie,
      numeroBrincos: value.numeroBrincos,
      dataNascimento,
      status: value.status,
      raca: value.raca,
      pelagem: value.pelagem,
      sexo: value.sexo,
      prenhez: value.prenhez,
      peso: value.peso,
      descricao: value.descricao,
    });
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly animalService: AnimalService,
    private readonly modalService: ModalService,
    private readonly herdService: HerdService,
    private readonly propertyService: PropertyService,
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
    this.loadRelationships();
  }

  loadRelationships(): void {
    this.herdService.getHerds(0, 200).subscribe({
      next: (page) => {
        this.herds = page.content;
      },
      error: (err) => console.error('Erro ao carregar rebanhos:', err),
    });

    this.propertyService.getProperties(0, 200).subscribe({
      next: (page) => {
        this.properties = page.content;
      },
      error: (err) => console.error('Erro ao carregar propriedades:', err),
    });
  }

  onSubmit(): void {
    if (!this.animalForm.valid) {
      return;
    }

    const formData = this.animalForm.value;

    if (this._dados) {
      this.animalService.updateAnimal({ ...this._dados, ...formData }).subscribe(() => {
        this.modalService.close(true);
      });
      return;
    }

    this.animalService.createAnimal(formData).subscribe(() => {
      this.modalService.close(true);
    });
  }

  cancel(): void {
    this.modalService.close();
  }

  get numeroBrincos() {
    return this.animalForm.get('numeroBrincos');
  }

  get raca() {
    return this.animalForm.get('raca');
  }

  get dataNascimento() {
    return this.animalForm.get('dataNascimento');
  }

  get peso() {
    return this.animalForm.get('peso');
  }

  compareById(option: { id?: number }, value: { id?: number }): boolean {
    return !!option && !!value && option.id === value.id;
  }
}
