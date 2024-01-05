import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineTrainingComponent } from './offline-training.component';

describe('OfflineTrainingComponent', () => {
  let component: OfflineTrainingComponent;
  let fixture: ComponentFixture<OfflineTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
