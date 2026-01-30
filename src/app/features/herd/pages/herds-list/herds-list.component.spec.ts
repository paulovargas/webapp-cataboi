import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HerdsListComponent } from './herds-list.component';
import { HerdService } from '../../services/herd.service';

describe('HerdsListComponent', () => {
  let component: HerdsListComponent;
  let fixture: ComponentFixture<HerdsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HerdsListComponent, HttpClientTestingModule],
      providers: [HerdService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HerdsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
