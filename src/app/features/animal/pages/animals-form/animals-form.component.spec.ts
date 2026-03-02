import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AnimalService } from '../../services/animal.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { AnimalsFormComponent } from './animals-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Animal } from '../../models/animal.model';
import { Property } from '../../../property/models/property.model';
import { Herd } from '../../../herd/models/herd.model';

describe('AnimalsFormComponent', () => {
  let component: AnimalsFormComponent;
  let fixture: ComponentFixture<AnimalsFormComponent>;
  let mockAnimalService: jasmine.SpyObj<AnimalService>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  const mockProperty: Property = {
    id: 1,
    nomePropriedade: 'Fazenda Santa Maria',
    localidade: 'Zona Rural',
    quantidadeAnimais: 100,
  };

  const mockHerd: Herd = {
    id: 1,
    nomeRebanho: 'Rebanho Principal',
    descriRebanho: 'Gado de corte',
    nomeCliente: 'João da Silva',
    quantidadeAnimais: 50,
  };

  const mockAnimal: Animal = {
    idanimal: 1,
    rebanho: mockHerd,
    propriedade: mockProperty,
    especie: 'Bovino',
    numeroBrincos: '12345',
    dataNascimento: '2023-01-15T00:00:00',
    status: 'Ativo',
    raca: 'Nelore',
    pelagem: 'Branca',
    sexo: 'Fêmea',
    prenhez: 'Nao',
    peso: 450,
    descricao: 'Animal saudável',
    foto: null,
  };

  beforeEach(async () => {
    mockAnimalService = jasmine.createSpyObj('AnimalService', ['createAnimal', 'updateAnimal']);
    mockModalService = jasmine.createSpyObj('ModalService', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        AnimalsFormComponent,
      ],
      providers: [
        { provide: AnimalService, useValue: mockAnimalService },
        { provide: ModalService, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call animalService.createAnimal when form is valid and not in edit mode', () => {
    mockAnimalService.createAnimal.and.returnValue(of({} as Animal));
    component.animalForm.setValue({
      idanimal: null,
      rebanho: mockHerd,
      propriedade: mockProperty,
      especie: 'Bovino',
      numeroBrincos: '54321',
      dataNascimento: '2024-01-01',
      status: 'Ativo',
      raca: 'Angus',
      pelagem: 'Preta',
      sexo: 'Macho',
      prenhez: 'Nao',
      peso: 500,
      descricao: 'Novo animal',
    });

    component.onSubmit();

    expect(mockAnimalService.createAnimal).toHaveBeenCalledWith(component.animalForm.value);
    expect(mockModalService.close).toHaveBeenCalled();
  });

  it('should call animalService.updateAnimal when form is valid and in edit mode', () => {
    mockAnimalService.updateAnimal.and.returnValue(of({} as Animal));
    component.dados = mockAnimal;
    fixture.detectChanges();

    component.animalForm.patchValue({ peso: 460 });

    component.onSubmit();

    const formValues = component.animalForm.value;
    const expectedPayload = {
      ...mockAnimal,
      ...formValues,
      // Re-apply the full objects for rebanho and propriedade if form only has IDs
      rebanho: formValues.rebanho,
      propriedade: formValues.propriedade
    };

    expect(mockAnimalService.updateAnimal).toHaveBeenCalledWith(jasmine.objectContaining({
      idanimal: mockAnimal.idanimal,
      peso: 460
    }));
    expect(mockModalService.close).toHaveBeenCalled();
  });

  it('should not call any service method if the form is invalid', () => {
    component.animalForm.patchValue({ numeroBrincos: '' }); // Make form invalid
    fixture.detectChanges();

    component.onSubmit();

    expect(mockAnimalService.createAnimal).not.toHaveBeenCalled();
    expect(mockAnimalService.updateAnimal).not.toHaveBeenCalled();
    expect(mockModalService.close).not.toHaveBeenCalled();
  });

  it('should populate the form when data is set', () => {
    component.dados = mockAnimal;
    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.animalForm.value.idanimal).toBe(mockAnimal.idanimal);
    expect(component.animalForm.value.numeroBrincos).toBe(mockAnimal.numeroBrincos);
  });
});
