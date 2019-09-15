import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditlogListComponent } from './auditlog-list.component';

describe('AuditlogListComponent', () => {
  let component: AuditlogListComponent;
  let fixture: ComponentFixture<AuditlogListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditlogListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
