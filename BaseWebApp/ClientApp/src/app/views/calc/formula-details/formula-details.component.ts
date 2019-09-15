import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, IFormula, IParameterFormula } from '@app/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-formula-details',
  templateUrl: './formula-details.component.html',
  styleUrls: ['./formula-details.component.scss']
})
export class FormulaDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModal') infoModal: ModalDirective;

  item: IFormula = null;
  currentId = 0;

  itemForm: FormGroup;
  paramForm: FormGroup;

  editingStatus = false;
  rows: IParameterFormula[] = [];
  selected: IParameterFormula[] = [];

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
    }

  ngOnInit() {
    this.itemForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      body: [null, [Validators.required]],
    });

    this.paramForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }
  }

  onReturn() {
    this._router.navigate(['/calc/formulas']);
  }

  onDelete() {
    this._dataService.delete(`/api/calc/formula/${this.currentId}`).subscribe(
      data => this.onSuccess()
    );
  }

  onDeleteParam() {
    const index = this.rows.indexOf(this.selected[0], 0);
    if (index > -1) {
      this.rows.splice(index, 1);
      this.rows = [...this.rows];
    }

    this.infoModal.hide();
    this._ns.success('El cambio fue realizado!');
  }

  onSubmit({ value, valid }: { value: IFormula, valid: boolean }) {
    if (valid) {
      value.parameters = this.rows;
      if (this.editingStatus) {
        this._dataService.post(`/api/calc/formula/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/calc/formula', value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  getItem(id: number) {
    this._dataService.get<IFormula>(`/api/calc/formula/${id}`).subscribe(
        data =>  {
          this.item = data;
          this.rows = this.item.parameters;
          this.itemForm.setValue({
            name: this.item.name,
            body: this.item.body,
          });
        }
      );
  }

  onClickModal() {
    this.selected = [];
    this.paramForm.setValue({
      name: '',
      value: ''
    });

    this.infoModal.show();
  }

  onSelect() {
    this.paramForm.setValue({
      name: this.selected[0].name,
      value: this.selected[0].value
    });

    this.infoModal.show();
  }

  onSubmitParam({ value, valid }: { value: IParameterFormula, valid: boolean }) {
    if (valid) {
      if (this.selected.length > 0) {
        this.selected[0].name = value.name;
        this.selected[0].value = value.value;
      } else {
        this.rows.splice(0, 0, value);
      }

      this.rows = [...this.rows];
      this.infoModal.hide();
    }
  }
}
