import { Component, OnInit } from '@angular/core';
import { IUserDelegate, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-delegate-list',
  templateUrl: './user-delegate-list.component.html',
  styleUrls: ['./user-delegate-list.component.scss']
})
export class UserDelegateListComponent implements OnInit {

  items: Array<IUserDelegate> = [];

  constructor(private _dataService: DataService,
    private _router: Router) { }

  ngOnInit() {
    this.getItems();
  }

  onSelect(item: IUserDelegate): void {
    this._router.navigate(['/account/delegate/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/account/delegate/new']);
  }

  getItems() {
    this._dataService.get<IUserDelegate[]>('/api/account/delegate').subscribe(
      data => this.items = data
    );
  }
}
