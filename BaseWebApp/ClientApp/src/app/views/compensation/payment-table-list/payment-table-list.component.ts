import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPaymentTable, DataService } from '@app/core';

@Component({
  selector: 'app-payment-table-list',
  templateUrl: './payment-table-list.component.html',
  styleUrls: ['./payment-table-list.component.scss']
})
export class PaymentTableListComponent implements OnInit {

  items: Array<IPaymentTable>;

  constructor(private _router: Router, private _dataService: DataService) { }

  ngOnInit() {
    this._dataService.get<IPaymentTable[]>('/api/compensation/paymenttable').subscribe(
      data => this.items = data
    );
  }

  onSelectCopy(item: IPaymentTable): void {
    this._router.navigate(['/compensation/payment-table/copy/', item.id]);
  }

  onSelectVersion(item: IPaymentTable): void {
    this._router.navigate(['/compensation/payment-table/version/', item.id]);
  }

  onSelect(item: IPaymentTable): void {
    this._router.navigate(['/compensation/payment-table/', item.id]);
  }

  onCreate() {
    this._router.navigate(['/compensation/payment-table/new']);
  }
}
