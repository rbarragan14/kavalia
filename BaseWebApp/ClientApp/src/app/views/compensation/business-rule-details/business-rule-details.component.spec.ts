import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleDetailsComponent } from './business-rule-details.component';

describe('BusinessRuleDetailsComponent', () => {
  let component: BusinessRuleDetailsComponent;
  let fixture: ComponentFixture<BusinessRuleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
