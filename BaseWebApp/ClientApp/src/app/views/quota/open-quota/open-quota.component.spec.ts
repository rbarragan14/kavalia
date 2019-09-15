import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenQuotaComponent } from './open-quota.component';

describe('OpenQuotaComponent', () => {
  let component: OpenQuotaComponent;
  let fixture: ComponentFixture<OpenQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
