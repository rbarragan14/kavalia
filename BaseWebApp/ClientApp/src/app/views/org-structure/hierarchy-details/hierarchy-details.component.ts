import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '@app/shared/components';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AppNotificationsService } from '@app/core/services/app-notifications.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IHierarchyTreeNode, IHierarchyStructureTree, IHierarchyTree } from '@app/core';
import { HierarchyService } from '@app/core/services/models/hierarchy.service';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '@app/core/services/models';

@Component({
  selector: 'app-hierarchy-details',
  templateUrl: './hierarchy-details.component.html',
  styleUrls: ['./hierarchy-details.component.scss']
})
export class HierarchyDetailsComponent
  extends BaseFormComponent
  implements OnInit {

  @ViewChild('infoModal') infoModal: ModalDirective;

  detailForm: FormGroup;
  editingStatus = false;
  currentId = 0;
  newVersion = false;
  versionNumber = 1;

  isCollapsed = false;
  iconCollapse = 'icon-arrow-up';

  times: Array<{ key: string, value: string }>;
  hierarchyStructureList: Array<{ key: string, value: string }>;
  hierarchyStructure: IHierarchyStructureTree;
  nodes: IHierarchyTreeNode[];

  constructor(private _router: Router,
    private _ns: AppNotificationsService,
    private _formBuilder: FormBuilder,
    private _hierarchyService: HierarchyService,
    private _catalogService: CatalogService,
    private _activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this._catalogService.getCatalogDictionary('PRD').subscribe(
      data => this.times = data
    );

    this._hierarchyService.getHierarchyStructureDictionary().subscribe(
      data => this.hierarchyStructureList = data
    );

    this.newVersion = !!this._activatedRoute.snapshot.url.find(u => u.path === 'version');
    if ('id' in this._activatedRoute.snapshot.params) {
      this.editingStatus = !this.newVersion;
      this.currentId = parseInt(this._activatedRoute.snapshot.params['id'], 10);
      this.getItem(this.currentId);
    } else {
      this.nodes = [];
    }

    this.detailForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
      finalDate: [null],
      version: [{value: this.versionNumber, disabled: true}],
      timeId: [null, [Validators.required]],
      hierarchyStructure: [{value: null, disabled: this.editingStatus || this.newVersion}, [Validators.required]],
      activeStatus: [true],
    });
  }

  onSubmit({ value, valid }: { value: IHierarchyTree, valid: boolean }) {
    if (valid) {
      value.nodes = this.nodes;
      value.version = this.versionNumber;
      value.hierarchyStructure = this.hierarchyStructure.id;
      if (this.editingStatus) {
        this._hierarchyService.updateHierarchyTree(this.currentId, value).subscribe(
          () => this.onSuccess()
        );
      } else {
        this._hierarchyService.createHierarchyTree(value).subscribe(
          () => this.onSuccess()
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
    this._router.navigate(['/org-structure/hierarchy']);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  onChangeStructure(event: any) {
    this.getStructure(event.value);
  }

  private getStructure(id: number) {
    this._hierarchyService.getHierarchyStructureTree(id).subscribe(
      data => {
        this.hierarchyStructure = data;
      });
  }

  private getItem(id: number) {
    this._hierarchyService.getHierarchyTree(id).subscribe(
      data => {
        this.versionNumber = this.newVersion ? data.version + 1 : data.version;
        this.detailForm.setValue({
          name: data.name,
          description: data.description,
          startDate: new Date(data.startDate),
          finalDate: data.finalDate !== null ? new Date(data.finalDate) : null,
          activeStatus: data.activeStatus,
          version: this.versionNumber,
          timeId: data.timeId,
          hierarchyStructure: data.hierarchyStructure,
        });

        this.hierarchyStructure = data.structure;
        this.nodes = data.nodes || [];
      }
    );
  }
}
