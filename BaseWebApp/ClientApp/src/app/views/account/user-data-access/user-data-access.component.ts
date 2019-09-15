import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { HierarchyService } from '@app/core/services/models';
import { DataService, IUser } from '@app/core';

@Component({
  selector: 'app-user-data-access',
  templateUrl: './user-data-access.component.html',
  styleUrls: ['./user-data-access.component.scss']
})
export class UserDataAccessComponent
  extends BaseFormComponent
  implements OnInit {

  detailForm: FormGroup;
  hierarchyList: Array<{ key: string, value: string }>;
  activeNodes: TreeNode[];
  currentId: number;

  constructor(private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _hierarchyService: HierarchyService,
    private _dataService: DataService,
    private _ns: AppNotificationsService) {
    super();
  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.params['id']) {
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getUser(this.currentId);
    }
    this._hierarchyService.getHierarchyDictionary().subscribe(
      data => this.hierarchyList = data
    );

    this.detailForm = this._formBuilder.group({
      name: [{ value: '', disabled: true }],
      hierarchy: [null],
    });
  }

  onReturn() {
    this._router.navigate(['/account/users']);
  }

  private getUser(id: number) {
    this._dataService.get<IUser>(`/api/account/user/${id}`).subscribe(
      data =>  {
          this.detailForm.patchValue({
          name: data.firstName + ' ' + data.lastName
        });
      }
    );
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.onSuccess();
    } else {
      this.validateAllFormFields(this.detailForm);
    }
  }

  onChangeHierarchy(event: any) {
    this.loadHierarchy(event.value);
  }

  onSuccess() {
    this._ns.success('El cambio fue realizado!');
    this.onReturn();
  }

  private loadHierarchy(id: number, selected?: number) {
    this._hierarchyService.getHierarchyTree(id).subscribe(
      data => {
        this.activeNodes = data.nodes || [];
        if (selected) {
///          this.selectedNode = this._hierarchyService.findStructureNodeById(data.nodes, selected);
        }
      }
    );
  }
}
