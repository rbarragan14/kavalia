import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/shared/components';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { CatalogService, IndicatorService } from '@app/core/services/models';
import { DataService, IIndicator } from '@app/core';

@Component({
  selector: 'app-indicator-details',
  templateUrl: './indicator-details.component.html',
  styleUrls: ['./indicator-details.component.scss']
})
export class IndicatorDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  ussageList: Array<{ key: string, value: string }> =
    [
      { value: 'Pantallas', key: '1' },
      { value: 'Administrador de Tareas', key: '2' },
      { value: 'Ninguno', key: '3' },
    ];

  ussageAppList: Array<{ key: string, value: string }> =
    [
      { value: 'Cuotas', key: '1' },
      { value: 'General', key: '2' },
    ];

  periodicityList: Array<{ key: string, value: string }>;
  item: IIndicator = null;
  detailForm: FormGroup;
  editingStatus = false;
  currentId = 0;
  newVersion = false;
  indicatorTypeList: Array<{ key: string, value: string }> = [];

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dataService: DataService,
    private _catalogService: CatalogService,
    private _indicatorService: IndicatorService,
    private _ns: AppNotificationsService
  ) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PRD').subscribe(
      data => this.periodicityList = data
    );

    this._catalogService.getCatalogDictionary('TIN').subscribe(
      data => this.indicatorTypeList = data
    );

    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'copy');
    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this._formBuilder.group({
      startDate: [null, [Validators.required]],
      finalDate: [null],
      indicatorTypeId: [null, [Validators.required]],
      ussageId: [null, [Validators.required]],
      dataInputId: [null, [Validators.required]],
      periodicityId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      thresholdMin: [null],
      thresholdMid: [null],
      thresholdMax: [null],
      comments: [null],
    });

  }

  onSubmit({ value, valid }: { value: IIndicator, valid: boolean }) {
    if (valid) {
      if (this.editingStatus) {
        this._dataService.post(`/api/indicator/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else if (!this.newVersion) {
        this._dataService.put('/api/indicator', value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put(`/api/indicator/copy/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onReturn() {
    this._router.navigate(['/indicators/indicators']);
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  getItem(id: number) {
    this._indicatorService.getIndicator(id).subscribe(
      data =>  {
        this.item = data;
        this.detailForm.patchValue({
          name: this.item.name,
          startDate: new Date(this.item.startDate),
          finalDate: this.item.finalDate !== null ? new Date(this.item.finalDate) : null,
          indicatorTypeId: this.item.indicatorTypeId,
          periodicityId: this.item.periodicityId,
          dataInputId: this.item.dataInputId,
          ussageId: this.item.ussageId,
          description: this.item.description,
          comments: this.item.comments,
          thresholdMin: this.item.thresholdMin,
          thresholdMid: this.item.thresholdMid,
          thresholdMax: this.item.thresholdMax,
          activeStatus: this.item.activeStatus,
        });
      }
    );
  }
}
