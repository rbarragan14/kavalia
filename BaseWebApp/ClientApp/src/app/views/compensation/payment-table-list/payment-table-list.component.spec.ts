import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTableListComponent } from './payment-table-list.component';

describe('PaymentTableListComponent', () => {
  let component: PaymentTableListComponent;
  let fixture: ComponentFixture<PaymentTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTableListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
