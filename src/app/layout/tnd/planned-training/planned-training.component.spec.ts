import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedTrainingComponent } from './planned-training.component';

describe('PlannedTrainingComponent', () => {
  let component: PlannedTrainingComponent;
  let fixture: ComponentFixture<PlannedTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannedTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannedTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
