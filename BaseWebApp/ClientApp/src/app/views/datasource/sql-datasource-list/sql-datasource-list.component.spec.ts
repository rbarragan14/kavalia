/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatasourceListComponent } from './sql-datasource-list.component';

describe('SqlDatasourceListComponent', () => {
  let component: SqlDatasourceListComponent;
  let fixture: ComponentFixture<SqlDatasourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlDatasourceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlDatasourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
