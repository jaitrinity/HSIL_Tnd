import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPlannedTrainingComponent } from './group-planned-training.component';

describe('GroupPlannedTrainingComponent', () => {
  let component: GroupPlannedTrainingComponent;
  let fixture: ComponentFixture<GroupPlannedTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPlannedTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPlannedTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
