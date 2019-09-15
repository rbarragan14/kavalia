import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFormulaComponent } from './apply-formula.component';

describe('ApplyFormulaComponent', () => {
  let component: ApplyFormulaComponent;
  let fixture: ComponentFixture<ApplyFormulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyFormulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
