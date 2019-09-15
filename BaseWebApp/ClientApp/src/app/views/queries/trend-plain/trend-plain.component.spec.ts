/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrendPlainComponent } from './trend-plain.component';

describe('TrendPlainComponent', () => {
  let component: TrendPlainComponent;
  let fixture: ComponentFixture<TrendPlainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendPlainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
