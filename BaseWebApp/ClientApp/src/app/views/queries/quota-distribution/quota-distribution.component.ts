import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-quota-distribution',
  templateUrl: './quota-distribution.component.html',
  styleUrls: ['./quota-distribution.component.css']
})
export class QuotaDistributionComponent implements OnInit {

  searchForm: FormGroup;
  logs: Array<any> = [];
  cols: Array<any> = [];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this._formBuilder.group({
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.mockData();
  }

  mockData() {
    for (let index = 1; index <= 10; index++) {
      const rowData: any = {};
      for (let indexValue = 0; indexValue <= 30; indexValue++) {
        if (indexValue === 0) {
          rowData[indexValue.toString()] = 'VL50' + index.toString();
        } else {
          rowData[indexValue.toString()] = Math.floor(Math.random() * 12000) + 1000  ;
        }

        if (index === 1) {
          const header = indexValue === 0 ? '' : indexValue.toString();
          this.cols.push({header: header, field: indexValue});
        }
      }

      this.logs.push(rowData);
    }
  }
}
