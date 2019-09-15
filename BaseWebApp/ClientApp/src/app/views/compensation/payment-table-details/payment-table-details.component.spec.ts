import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTableDetailsComponent } from './payment-table-details.component';

describe('PaymentTableDetailsComponent', () => {
  let component: PaymentTableDetailsComponent;
  let fixture: ComponentFixture<PaymentTableDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTableDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
