import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupTrainingComponent } from './assign-group-training.component';

describe('AssignGroupTrainingComponent', () => {
  let component: AssignGroupTrainingComponent;
  let fixture: ComponentFixture<AssignGroupTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignGroupTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
