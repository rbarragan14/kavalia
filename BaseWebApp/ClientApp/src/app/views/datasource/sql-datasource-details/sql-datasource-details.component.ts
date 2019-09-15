import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { Router } from '@angular/router';
import { BaseFormComponent } from '@app/shared/components';
import { QueryBuilderConfig, RuleSet } from 'angular2-query-builder';
import { QueryBuilderClassNames } from 'angular2-query-builder/dist/components';
import { ActivatedRoute } from '@angular/router';
import { DataService, ISqlDataSource, ISqlDataBase, ISqlField } from '@app/core';
import { DataSourceService } from '@app/core/services/models/datasource.service';

@Component({
  selector: 'app-sql-datasource-details',
  templateUrl: './sql-datasource-details.component.html',
  styleUrls: ['./sql-datasource-details.component.scss']
})
export class SqlDatasourceDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  databases: Array<{ key: string, value: string }>;
  tables: Array<{ key: string, value: string }>;
  config: QueryBuilderConfig = { fields: {} };
  operators: Array<{ key: string, value: string }> =
  [
    { value: 'AND', key: '1' },
    { value: 'OR', key: '2' },
  ];

  list1: ISqlField[] = [];
  list2: ISqlField[] = [];

  query: RuleSet = {
    condition: 'and',
    rules: []
  };

  classNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto px-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  };
/*
  public labels: QueryBuilderLabels = {
    rule: 'Regla',
    ruleset: 'Grupo',
    emptyRuleset: 'El grupo no debe estar vacio'
  };
*/
  isCollapsed = false;
  iconCollapse = 'icon-arrow-up';

  database: ISqlDataBase;
  item: ISqlDataSource = null;
  editingStatus = false;
  currentId = 0;
  detailForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _ns: AppNotificationsService,
    private _dataService: DataService,
    private _dataSourceService: DataSourceService,
    private _router: Router) {
    super();
  }

  ngOnInit() {
    this._dataSourceService.getSqlDataBasesDictionary().subscribe(
      data => this.databases = data
    );

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      activeStatus: [true],
      sqlDataBaseId: [null, [Validators.required]],
      sqlTableId: [null, [Validators.required]],
    });
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  onSubmit({ value, valid }: { value: ISqlDataSource, valid: boolean }) {
    if (valid) {
      value.sqlFields = this.list2;
      value.query = JSON.stringify(this.query);

      if (this.editingStatus) {
        this._dataService.post(`/api/datasource/sql/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/datasource/sql', value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/datasource/sql']);
  }

  onDataBaseChange(event: any) {
    this.getDataBase(event.value);
  }

  onDataTableChange(event: any) {
    this.setUpQueryBuilder(event.value);
  }

  private getDataBase(id: number, selectedTableId?: number, query?: string, selecteFields?: ISqlField[]) {
    this._dataService.get<ISqlDataBase>(`/api/datasource/database/${id}`).subscribe(
      data => {
        this.database = data;
        this.tables = this._dataSourceService.getSqlDataTablesDictionaryFromSqlDatabase(data);
        if (selectedTableId) {
          this.setUpQueryBuilder(selectedTableId, selecteFields);
        }
        if (query) {
          this.query = JSON.parse(query);
        }
      });
  }

  private setUpQueryBuilder(selectedTableId: number, selecteFields?: ISqlField[]) {
    const selectedTable = this.database.sqlTables.find(t => t.id.toString() === selectedTableId.toString());
    this.config = { fields: {}};
    selectedTable.fields.forEach(x => {
      this.config.fields[x.name] = {
        name: x.name,
        type: x.type
      };
    });

    const allFields = selectedTable.fields.map(x => Object.assign({}, x));
    this.list1 = selecteFields ? allFields.filter(x => !selecteFields.find(y => y.id === x.id)) : allFields;
    this.list2 = selecteFields ? allFields.filter(x => selecteFields.find(y => y.id === x.id)) : [];
  }

  getItem(id: number) {
    this._dataService.get<ISqlDataSource>(`/api/datasource/sql/${id}`).subscribe(
      data =>  {
        this.item = data;
        this.getDataBase(this.item.sqlDataBaseId, this.item.sqlTableId, this.item.query, this.item.sqlFields);

        this.detailForm.patchValue({
          name: this.item.name,
          description: this.item.description,
          activeStatus: this.item.activeStatus,
          sqlDataBaseId: this.item.sqlDataBaseId,
          sqlTableId: this.item.sqlTableId,
        });
      }
    );
  }
}
