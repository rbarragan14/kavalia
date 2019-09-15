import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../../shared/components';
import { AppNotificationsService } from '../../../core/services/app-notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-formula',
  templateUrl: './apply-formula.component.html',
  styleUrls: ['./apply-formula.component.scss']
})
export class ApplyFormulaComponent
  extends BaseFormComponent
  implements OnInit {

  detailForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService,
    private _router: Router) {
    super();
  }

  ngOnInit() {
    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.detailForm.valid) {
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
    this._router.navigate(['/']);
  }
}
