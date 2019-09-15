import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogAssociateListComponent } from './catalog-associate-list.component';

describe('CatalogAssociateListComponent', () => {
  let component: CatalogAssociateListComponent;
  let fixture: ComponentFixture<CatalogAssociateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogAssociateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogAssociateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
