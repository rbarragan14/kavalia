/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorHierarchySelectionComponent } from './indicator-hierarchy-selection.component';

describe('IndicatorHierarchySelectionComponent', () => {
  let component: IndicatorHierarchySelectionComponent;
  let fixture: ComponentFixture<IndicatorHierarchySelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorHierarchySelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorHierarchySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
