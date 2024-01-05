import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTrainingComponent } from './group-training.component';

describe('GroupTrainingComponent', () => {
  let component: GroupTrainingComponent;
  let fixture: ComponentFixture<GroupTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
