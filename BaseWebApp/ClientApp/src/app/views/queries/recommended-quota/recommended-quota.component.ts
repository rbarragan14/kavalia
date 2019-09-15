import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-recommended-quota',
  templateUrl: './recommended-quota.component.html',
  styleUrls: ['./recommended-quota.component.css']
})
export class RecommendedQuotaComponent implements OnInit {

  searchForm: FormGroup;
  logs: Array<any> = [];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this._formBuilder.group({
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.mockData();
  }

  mockData() {
    this.logs = [
      {
        variable: 'VL5101',
        value1: '1600',
        value2: '1123',
        total: '17943',
      },
      {
        variable: 'VL5102',
        value1: '1400',
        value2: '1323',
        total: '15943',
      },
      {
        variable: 'VL5103',
        value1: '1410',
        value2: '1223',
        total: '15943',
      },
    ];
  }
}
