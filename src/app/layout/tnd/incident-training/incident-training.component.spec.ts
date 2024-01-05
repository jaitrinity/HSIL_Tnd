import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentTrainingComponent } from './incident-training.component';

describe('IncidentTrainingComponent', () => {
  let component: IncidentTrainingComponent;
  let fixture: ComponentFixture<IncidentTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
