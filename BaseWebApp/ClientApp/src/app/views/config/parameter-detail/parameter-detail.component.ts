import { Component, OnInit } from '@angular/core';
import { IParameter, DataService, UtilityService } from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { BaseFormComponent } from '@app/shared/components';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-parameter-detail',
  templateUrl: './parameter-detail.component.html',
  styleUrls: ['./parameter-detail.component.scss']
})
export class ParameterDetailComponent
  extends BaseFormComponent
  implements OnInit {

  item: IParameter = null;
  currentId = 0;
  nodes: TreeNode[] = [];
  options: Array<{ key: string, value: string }>;
  selectedNodes: any;
  treeSelectionMode = 'single';

  itemForm: FormGroup;
  editingStatus = false;
  parameterType = 'text';
  enableResource = false;
  resurceLink = '';
  resourceName = '';

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: FormBuilder,
    private _us: UtilityService,
    private _ns: AppNotificationsService) {
    super();
  }

  ngOnInit() {
    const validators = this.editingStatus ? null : Validators.compose([Validators.required]);
    this.itemForm = this._formBuilder.group({
      parameterId: [{ value: null, disabled: this.editingStatus }, validators],
      name: [null, [Validators.required]],
      value: [null]
    });

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = true;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    }
  }

  onReturn() {
    this._router.navigate(['/config/parameters']);
  }

  onResource() {
    this._router.navigate([this.resurceLink]);
  }

  onSubmit({ value, valid }: { value: IParameter, valid: boolean }) {
    if (valid && this.validateValue(value)) {
      if (this.editingStatus) {
        this._dataService.post(`/api/parameter/${this.currentId}`, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._dataService.put('/api/parameter', value).subscribe(
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
    this._dataService.get<IParameter>(`/api/parameter/${id}`).subscribe(
      data => {
        this.itemForm.setValue({
          parameterId: data.parameterId,
          name: data.name,
          value: data.value,
        });

        this.setupForm(data);
        this.item = data;
      }
    );
  }

  private setupForm(data: IParameter) {
    if (data.type === 'boolean') {
      this.itemForm.patchValue({
        value: data.value === 'true'
      });
      this.enableResource = data.resource && data.value === 'true';
      this.parameterType = 'switch';
      this.resurceLink = data.resource;
      this.resourceName = data.resourceName;
    } else if (data.type === 'tree' || data.type === 'tree-ms') {
      this.parameterType = 'tree';
      this.nodes = JSON.parse(data.options).options;
      if (data.type === 'tree-ms') {
        this.treeSelectionMode = 'checkbox';
        this.selectedNodes = this.findNodes(this.nodes, data.value);
      } else {
        this.selectedNodes = this._us.findNode(this.nodes, data.value);
      }
      this._us.expandTree(this.nodes);
    } else if (data.type === 'dropdown') {
      this.options = JSON.parse(data.options).options;
      this.parameterType = 'dropdown';
    }
  }

  private validateValue(data: IParameter): boolean {
    if (this.item.type === 'tree') {
      if (!this.selectedNodes) {
        this._ns.warning('Debe seleccionar un valor !');
        return false;
      } else {
        data.value = this.selectedNodes.data.id;
      }
    } else if (this.item.type === 'tree-ms') {
      if (!this.selectedNodes || this.selectedNodes.length === 0) {
        this._ns.warning('Debe seleccionar un valor !');
        return false;
      } else {
        data.value = JSON.stringify(this.selectedNodes.map((s: TreeNode) => s.data.id));
      }
    }

    return true;
  }

  private findNodes(tree: TreeNode[], ids: string): TreeNode[] {
    if (!ids) {
      return [];
    }

    const nodes: string[] = JSON.parse(ids);
    return nodes.map(n => this._us.findNode(tree, n.toString()));
  }
}
