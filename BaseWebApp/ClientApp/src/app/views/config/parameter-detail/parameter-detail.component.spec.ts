import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDetailComponent } from './parameter-detail.component';

describe('ParameterDetailComponent', () => {
  let component: ParameterDetailComponent;
  let fixture: ComponentFixture<ParameterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
