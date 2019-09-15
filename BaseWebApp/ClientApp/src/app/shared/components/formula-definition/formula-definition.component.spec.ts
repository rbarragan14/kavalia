import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormulaDefinitionComponent } from './formula-definition.component';

describe('FormulaDefinitionComponent', () => {
  let component: FormulaDefinitionComponent;
  let fixture: ComponentFixture<FormulaDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
