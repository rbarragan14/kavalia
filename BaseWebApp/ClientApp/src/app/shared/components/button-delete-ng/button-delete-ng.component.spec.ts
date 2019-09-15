/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDeleteNgComponent } from './button-delete-ng.component';

describe('ButtonDeleteNgComponent', () => {
  let component: ButtonDeleteNgComponent;
  let fixture: ComponentFixture<ButtonDeleteNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonDeleteNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonDeleteNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
