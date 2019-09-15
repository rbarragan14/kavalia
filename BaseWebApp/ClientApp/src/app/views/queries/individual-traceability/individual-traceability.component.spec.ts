import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualTraceabilityComponent } from './individual-traceability.component';

describe('IndividualTraceabilityComponent', () => {
  let component: IndividualTraceabilityComponent;
  let fixture: ComponentFixture<IndividualTraceabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualTraceabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualTraceabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
