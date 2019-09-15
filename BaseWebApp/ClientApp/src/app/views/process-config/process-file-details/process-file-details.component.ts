import { Component, OnInit } from '@angular/core';
import { IProcessingFile } from '@app/core/models/ProcessingFile';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@app/core';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';

@Component({
  selector: 'app-process-file-details',
  templateUrl: './process-file-details.component.html',
  styleUrls: ['./process-file-details.component.scss']
})
export class ProcessFileDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  item: IProcessingFile = null;
  currentId = 0;
  fileTypes: Array<{ key: string, value: string }> =
  [
    { value: 'Carga', key: '1' },
    { value: 'Descarga', key: '2' }
  ];

  fileFormats: Array<{ key: string, value: string }> =
  [
    { value: 'CSV', key: '1' },
    { value: 'Fijo', key: '3' },
  ];

  detailForm: FormGroup;
  editingStatus = false;

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private formBuilder: FormBuilder,
    private _ns: AppNotificationsService) {
      super();
  }

  ngOnInit() {
    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }

    this.detailForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      path: [null, [Validators.required]],
      format: [null, [Validators.required]],
      type: [null, [Validators.required]],
    });
  }

  getItem(id: number) {
    this._dataService.get<IProcessingFile>(`/api/file/processing-file/${id}`).subscribe(
        data =>  {
          this.item = data;

          this.detailForm.setValue({
            name: this.item.name,
            path: this.item.path,
            format: this.item.format,
            type: this.item.type,
          });
        }
      );
  }

  onDelete() {
    this._dataService.delete(`/api/file/processing-file/${this.currentId}`).subscribe(
      data => this.onSuccess()
    );
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  onReturn() {
    this._router.navigate(['/process-config/files']);
  }

  onSubmit({ value, valid }: { value: IProcessingFile, valid: boolean }) {
    if (valid) {
      if (this.editingStatus) {
        this._dataService.post(`/api/file/processing-file/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/file/processing-file', value).subscribe(
          data => this.onSuccess()
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }
}
