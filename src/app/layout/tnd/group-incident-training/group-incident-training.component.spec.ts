import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupIncidentTrainingComponent } from './group-incident-training.component';

describe('GroupIncidentTrainingComponent', () => {
  let component: GroupIncidentTrainingComponent;
  let fixture: ComponentFixture<GroupIncidentTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupIncidentTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupIncidentTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
