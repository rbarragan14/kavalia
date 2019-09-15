import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTableSelectionComponent } from './payment-table-selection.component';

describe('PaymentTableSelectionComponent', () => {
  let component: PaymentTableSelectionComponent;
  let fixture: ComponentFixture<PaymentTableSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTableSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTableSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
