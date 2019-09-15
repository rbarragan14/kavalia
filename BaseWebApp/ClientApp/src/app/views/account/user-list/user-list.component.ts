import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services/data.service';
import { IUser } from '@app/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: Array<IUser> = [];
  errorMessage: any;

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getUsers();
  }

  onSelect(catalog: IUser): void {
    this._router.navigate(['/account/users/', catalog.id]);
  }

  onCreate() {
    this._router.navigate(['/account/users/new']);
  }

  getUsers() {
    this._dataService.get<IUser[]>('/api/account/user').subscribe(
      data => this.users = data
    );
  }
}
