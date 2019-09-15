import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogAssociateDetailsComponent } from './catalog-associate-details.component';

describe('CatalogAssociateComponent', () => {
  let component: CatalogAssociateDetailsComponent;
  let fixture: ComponentFixture<CatalogAssociateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogAssociateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogAssociateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
