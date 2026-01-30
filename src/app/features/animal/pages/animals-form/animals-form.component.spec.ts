import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsFormComponent } from './animals-form.component';

describe('AnimalsFormComponent', () => {
  let component: AnimalsFormComponent;
  let fixture: ComponentFixture<AnimalsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
