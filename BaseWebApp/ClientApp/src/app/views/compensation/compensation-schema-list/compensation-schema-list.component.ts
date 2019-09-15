import { Component, OnInit } from '@angular/core';
import { ICompensationSchema, DataService } from '@app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compensation-schema-list',
  templateUrl: './compensation-schema-list.component.html',
  styleUrls: ['./compensation-schema-list.component.scss']
})
export class CompensationSchemaListComponent implements OnInit {

  items: Array<ICompensationSchema>;
  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.get<ICompensationSchema[]>('/api/compensation/schema').subscribe(
      data => this.items = data
    );
  }

  onSelect(item: ICompensationSchema): void {
    this._router.navigate(['/compensation/schema/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/compensation/schema/new']);
  }
}
