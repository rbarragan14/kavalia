import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-data-import',
  templateUrl: './data-import.component.html',
  styleUrls: ['./data-import.component.css']
})
export class DataImportComponent
  extends BaseFormComponent
  implements OnInit {

  fileFormatList: Array<{ key: string, value: string }> =
    [
      { value: 'Formato 1', key: '1' },
      { value: 'Formato 2', key: '2' },
      { value: 'Formato 3', key: '3' },
    ];

  detailForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _ns: AppNotificationsService) {
    super();
  }

  onSubmit() {
    if (this.detailForm.valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onSuccess() {
    this._ns.success('El archivo fue cargado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/']);
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      file: [null],
      format: [null, [Validators.required]],
    });
  }
}
