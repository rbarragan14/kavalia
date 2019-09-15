import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaReviewComponent } from './quota-review.component';

describe('QuotaReviewComponent', () => {
  let component: QuotaReviewComponent;
  let fixture: ComponentFixture<QuotaReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotaReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotaReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
