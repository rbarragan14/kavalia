/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlDatasourceDetailsComponent } from './sql-datasource-details.component';

describe('SqlDatasourceDetailsComponent', () => {
  let component: SqlDatasourceDetailsComponent;
  let fixture: ComponentFixture<SqlDatasourceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqlDatasourceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqlDatasourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
