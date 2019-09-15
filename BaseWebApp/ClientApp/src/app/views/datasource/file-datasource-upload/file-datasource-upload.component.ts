import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { Router } from '@angular/router';
import { DataSourceService, HierarchyService } from '@app/core/services/models';
import { IFileDataSource, DataService, IFileDataSourceField } from '@app/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-file-datasource-upload',
  templateUrl: './file-datasource-upload.component.html',
  styleUrls: ['./file-datasource-upload.component.scss']
})

export class FileDatasourceUploadComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('hierarchySelectModal') hierarchySelectModal: ModalDirective;
  newFormatId = '0';
  editingStatus = false;
  currentId = 1;
  selectedNode: TreeNode;
  hierarchySelectedIndex: number;

  formats: Array<{ key: string, value: string }>;
  hierarchyStructureList: Array<{ key: string, value: string }>;
  activeNodes: TreeNode[] = [];

  fileTypes: Array<{ key: string, value: string }> =
    [
      { value: 'Texto', key: '1' }
    ];

  format: IFileDataSourceField[] = [];
  hierarchyForm: FormGroup;
  detailForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
    private _router: Router,
    private _dataSourceService: DataSourceService,
    private _hierarchyService: HierarchyService,
    private _dataService: DataService,
    private _ns: AppNotificationsService) {
    super();
  }

  onSubmit({ value, valid }: { value: IFileDataSource, valid: boolean }) {
    if (valid && this.validFormat()) {
      value.fileDataSourceFields = this.format;
      if (this.editingStatus) {
        this._dataService.post(`/api/datasource/file/${this.currentId}`, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._dataService.put<IFileDataSource>('/api/datasource/file', value).subscribe(
          data => {
            this.editingStatus = true;
            this.currentId = data.id;
            this.detailForm.patchValue({ fileFormat: data.id });
            this.onSuccess();
          }
        );
      }
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  private validFormat(): boolean {

    if (this.format.length === 0) {
      this._ns.warning('Definición inválida, debe incluir por lo menos un dato');
      return false;
    }

    if (this.format.some(element => {
      return (!element.position);
    })) {
      this._ns.warning('Definición inválida!');
      return false;
    }

    return true;
  }

  onSuccess() {
    this._ns.success('Definición almacenada!');
    this.loadDataSources();
  }

  onReturn() {
    this._router.navigate(['/']);
  }

  ngOnInit() {
    this._hierarchyService.getHierarchyStructureDictionary().subscribe(
      data => this.hierarchyStructureList = data
    );

    this.loadDataSources();
    this.initFormat();

    this.detailForm = this._formBuilder.group({
      file: [null],
      fileFormat: [this.newFormatId, [Validators.required]],
      fileType: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });

    this.hierarchyForm = this._formBuilder.group({
      hierarchy: [null],
    });
  }

  onChangeFormat(event: any) {
    if (event.value !== this.newFormatId) {
      this.editingStatus = true;
      this.currentId = event.value;
      this.getFormat(event.value);
    } else {
      this.detailForm.reset();
      this.detailForm.patchValue({ fileFormat: this.newFormatId });
      this.editingStatus = false;
      this.initFormat();
    }
  }

  onUpload() {
    this._ns.success('El archivo fue cargado!');
    this.onReturn();
  }

  deleteSelecteRow(index: number) {
    if (index > -1) {
      this.format.splice(index, 1);
      this.format.forEach((f, i) => f.name = `Dato ${i + 1}`);
    }
  }

  addData() {
    this.format.push({
      id: 0,
      name: `Dato ${this.format.length + 1}`,
      isDate: false,
      hierarchyStructureId: null,
      hierarchyStructureNodeId: null,
      position: null,
    });
  }

  private loadDataSources() {
    this._dataSourceService.getFileDataSourceDictionary().subscribe(
      data => {
        this.formats = data;
        this.formats.unshift({ value: '(Nuevo)', key: this.newFormatId });
      }
    );
  }

  private getFormat(id: number) {
    this._dataService.get<IFileDataSource>(`/api/datasource/file/${id}`).subscribe(
      data => {
        this.format = data.fileDataSourceFields;
        this.detailForm.patchValue({
          name: data.name,
          fileType: data.fileType,
        }
        );
      }
    );
  }

  private initFormat() {
    this.format = [];
  }

  onHierarcySelect(index: number) {
    if (index > -1) {
      this.hierarchySelectedIndex = index;
      const selected = this.format[this.hierarchySelectedIndex];
      if (selected.hierarchyStructureNodeId && selected.hierarchyStructureId) {
          this.hierarchyForm.setValue({ hierarchy: selected.hierarchyStructureId });
          this.loadHierarchyStructure(selected.hierarchyStructureId, selected.hierarchyStructureNodeId);
      }
      this.hierarchySelectModal.show();
    }
  }

  onChangeHierarchy(event: any) {
    this.loadHierarchyStructure(event.value);
  }

  onSelectHierarchy({ value, valid }: { value: any, valid: boolean }) {
    this.hierarchySelectModal.hide();
    if (this.selectedNode) {
      this.format[this.hierarchySelectedIndex].hierarchyStructureId = value.hierarchy;
      this.format[this.hierarchySelectedIndex].hierarchyStructureNodeId = this.selectedNode.data.id;
    } else {
      this.format[this.hierarchySelectedIndex].hierarchyStructureId = null;
      this.format[this.hierarchySelectedIndex].hierarchyStructureNodeId = null;
    }
  }

  private loadHierarchyStructure(id: number, selected?: number) {
    this._hierarchyService.getHierarchyStructureTree(id).subscribe(
      data => {
        this.activeNodes = data.nodes || [];
        if (selected) {
          this.selectedNode = this._hierarchyService.findStructureNodeById(data.nodes, selected);
        }
      }
    );
  }
}
