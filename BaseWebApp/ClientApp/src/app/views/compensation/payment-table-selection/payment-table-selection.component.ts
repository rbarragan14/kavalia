import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IPaymentTableSelection } from '@app/core';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { IndicatorService } from '@app/core/services/models';

@Component({
  selector: 'app-payment-table-selection',
  templateUrl: './payment-table-selection.component.html',
  styleUrls: ['./payment-table-selection.component.scss']
})
export class PaymentTableSelectionComponent
  extends BaseFormComponent
  implements OnInit {

  paymentTableList: Array<{ key: string, value: string }> =
  [
    { value: 'Tabla Pago 1', key: '1' },
    { value: 'Tabla Pago 2', key: '2' },
    { value: 'Tabla Pago 3', key: '3' },
  ];

  indicatorList: Array<{ key: string, value: string }>;
  detailForm: FormGroup;

  constructor(private _router: Router,
    private _ns: AppNotificationsService,
    private _indicatorService: IndicatorService,
    private _formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this._indicatorService.getIndicatorDictionary().subscribe(
      data => this.indicatorList = data
    );

    this.detailForm = this._formBuilder.group({
      startDate: [null, [Validators.required]],
      paymentTable: [null, [Validators.required]],
      fixed: [true],
      finalDate: [null, [Validators.required]],
      aditional: [false],
      adjustmentFactor: [null, [Validators.required]],
      indicator: [null, [Validators.required]],
    });
  }

  onSubmit({ value, valid }: { value: IPaymentTableSelection, valid: boolean }) {
    if (valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/compensation/business-rules']);
  }
}
