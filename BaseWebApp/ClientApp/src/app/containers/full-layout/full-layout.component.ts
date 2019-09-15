import { Component, OnInit } from '@angular/core';
import { DataService, AccountService } from '@app/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  public navItems: any[] = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;

  constructor(private _dataService: DataService,
    private _accountService: AccountService) {
      this.changes = new MutationObserver((mutations) => {
        this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
      });

      this.changes.observe(<Element>this.element, {
        attributes: true
      });
  }

  ngOnInit(): void {
    this.getNavigationItems();
  }

  getNavigationItems() {
    this._dataService.get<any[]>(`/api/account/menu`).subscribe(
      (data: any) =>  {
        this.navItems = data;
      }
    );
  }

  public logout() {
    this._accountService.logout();
  }
}
