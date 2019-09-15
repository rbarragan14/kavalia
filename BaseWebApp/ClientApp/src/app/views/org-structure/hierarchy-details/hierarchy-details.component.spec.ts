import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyDetailsComponent } from './hierarchy-details.component';

describe('HierarchyDetailsComponent', () => {
  let component: HierarchyDetailsComponent;
  let fixture: ComponentFixture<HierarchyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
