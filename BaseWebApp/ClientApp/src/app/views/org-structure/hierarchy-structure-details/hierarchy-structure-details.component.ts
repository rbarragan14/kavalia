import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHierarchyStructureTreeNode, IHierarchyStructureTree } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';
import { CatalogService } from '@app/core/services/models';

@Component({
  selector: 'app-hierarchy-structure-details',
  templateUrl: './hierarchy-structure-details.component.html',
  styleUrls: ['./hierarchy-structure-details.component.scss']
})
export class HierarchyStructureDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  isCollapsed = false;
  iconCollapse = 'icon-arrow-up';
  currentId = 0;
  newVersion = false;
  versionNumber = 1;
  detailForm: FormGroup;
  showGroupField = false;

  positionsList: Array<{ key: string, value: string }>;
  editingStatus = false;
  nodes: IHierarchyStructureTreeNode[];

  constructor(private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _catalogService: CatalogService,
    private _ns: AppNotificationsService,
    private _hierarchyService: HierarchyService,
    private _formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PSC').subscribe(
      data => this.positionsList = data
    );

    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'version');
    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      finalDate: [null],
      positionId: [null],
      activeStatus: [true],
      groupByPosition: [false],
      version: [{value: this.versionNumber, disabled: true}],
    });

    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    } else {
      this.nodes = [];
    }
  }

  onSubmit({ value, valid }: { value: IHierarchyStructureTree, valid: boolean }) {
    if (valid) {
      value.nodes = this.nodes;
      value.version = this.versionNumber;
      if (this.editingStatus) {
        this._hierarchyService.updateHierarchyStructureTree(this.currentId, value).subscribe(
          data => this.onSuccess()
        );
      } else {
        this._hierarchyService.createHierarchyStructureTree(value).subscribe(
          data => this.onSuccess()
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
    this._router.navigate(['/org-structure/hierarchy-structure']);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  getItem(id: number) {
    this._hierarchyService.getHierarchyStructureTree(id).subscribe(
      data => {
        this.versionNumber = this.newVersion ? data.version + 1 : data.version;
        this.detailForm.setValue({
          name: data.name,
          startDate: new Date(data.startDate),
          finalDate: data.finalDate !== null ? new Date(data.finalDate) : null,
          activeStatus: data.activeStatus,
          groupByPosition: data.groupByPosition,
          version: this.versionNumber,
          positionId: data.positionId
        });

        this.onChangeAgrupar({ checked: data.groupByPosition});
        this.nodes = data.nodes || [];
      }
    );
  }

  onChangeAgrupar(event: any) {
    this.showGroupField = event.checked;
    this.setRequired(this.detailForm.controls['positionId'], this.showGroupField );
  }
}
