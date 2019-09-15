import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { IRole } from '../../../core/models/Role';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  roles: Array<IRole> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getRoles();
  }

  onSelect(catalog: IRole): void {
    this._router.navigate(['/account/roles/', catalog.id]);
  }

  onCreate() {
    this._router.navigate(['/account/roles/new']);
  }

  getRoles() {
    this._dataService.get<IRole[]>('/api/account/role').subscribe(
      data => this.roles = data
    );
  }
}
